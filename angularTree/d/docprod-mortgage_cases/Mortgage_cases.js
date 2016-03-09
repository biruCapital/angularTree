var PHP_GET_FILENAME = "docprod-mortgage_cases/get_Mortgage_cases.php",
    PHP_INSUPD_FILENAME = "docprod-mortgage_cases/insupd_Mortgage_cases.php",
    PHP_INSUPD_APPLICATION_FILENAME = "docprod-mortgage_cases/insupd_Loan_applicants.php";

$(function () {
    // Get a client's name from the search string
    var getVars = new (function (search_string) {
        if (search_string.length > 1) {
            for (var pair, pairs = search_string.substr(1).split("&"), i = 0; i < pairs.length; ++i) {
                pair = pairs[i].split("=");
                this[decodeURIComponent(pair[0])] = pair.length > 1 ? decodeURIComponent(pair[1]) : "";
            }
        }
    })(window.location.search);

    var iCabz = {
        client_name: typeof getVars.name === "undefined" ? "" : getVars.name,
        default_client_id: 0
    };
//{field: "id", title: "Id"},
                //{field: "client_id", title: "Client Id"},
                //{field: "broker_id", title: "Customer"},
    var $crudGrid = $("#crud-grid"),
        gridColumns = [
                
                
                {field: "reference", title: "Reference"},
                {field: "customer_surname", title: "Customer Surname"}
            ],
        dataSource = {
            transport: {
                read: function (options) {
                    console.log("Read", options);
                    readAjaxFn(options);
                },
                update: function (options) {
                    console.log("Save", options);
                    updateAjaxFn(options);
                },
                create: function (options) {
                    console.log("Create", options);
                    createAjaxFn(options);
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: {type: "string", defaultValue: "0"},
                        client_id: {type: "number"},
                        broker_id: {type: "number"},
                        reference: {type: "string"},
                        customer_surname: {type: "string"},
                        total_loan_amount: {type: "number"},
                        status: {type: "string"},
                        sales_id: {type: "number"},
                        createdate: {type: "date"},

                        propid: {type: "string", defaultValue: "0"},
                        propclient_id: {type: "number"},
                        propcase_id: {type: "number"},
                        proploan_amount: {type: "number"},
                        property_value: {type: "number"},
                        propaddressnumber: {type: "string"},
                        propstreet1: {type: "string"},
                        propstreet2: {type: "string"},
                        propcity: {type: "string"},
                        proppostcode: {type: "string"},
                        propfurther_advance: {type: "boolean", parse: dps.parseBool},
                        propremortgage: {type: "boolean", parse: dps.parseBool},
                        propexsisting_monthly_payments: {type: "number"},
                        propexsisting_mortgage_balance: {type: "number"},
                        propfinancial_difficultied: {type: "boolean", parse: dps.parseBool},
                        proptype_of_mortgage: {type: "string", defaultValue: "Standard"},
                        propcreatedate: {type: "date"}
                    }
                }
            },
            error: function (e) {
                console.log("Error ", e);
                $("#crud-grid").data('kendoGrid').cancelChanges();

                alert("The server returned an error.\n" + e.xhr.responseText);
            }
        };

    $crudGrid.kendoGrid({
        columns: gridColumns,
        sortable: true,
        dataSource: dataSource,
        editable: {
            mode: "popup",
            template: kendo.template($("#popup-editor").html())
        },
        selectable: "true",
        change: function () {
            var selectedRows = this.select();
            showEdit(this.dataItem(selectedRows[0]));
        },
        toolbar: [{name: "create", text: "Add new record"}],
        pageable: {
            pageSize: 15,
            buttonCount: 5
        },
        navigatable: false,
        height: "443px",
        edit: function (e) {
            // Apply width of the form and center
            $(e.container).parent().css({
                "width": "930px"
            }).data("kendoWindow");
            $(".k-edit-form-container").parent().data("kendoWindow").center();

            if (!e.model.isNew()) {
                $(".k-update").parent().html($(".k-update").parent().html().replace("Update","Next"))
                console.log("Edit");
                 

            } else {
                 $(".k-update").parent().html($(".k-update").parent().html().replace("Update","Next"))
                console.log("Add");
                e.model.set("client_id", iCabz.default_client_id);

            }
                        // Initialize the tabs
            var onActivate = function(e) {
                if (e.item.id !== "detailsTab") {
                    //$(".k-grid-update").css("display", "none");
                } else {
                    $(".k-grid-update").css("display", "inline-block");
                }
            };
            $("#tabstrip").kendoTabStrip({
                contentUrls: [
                    null,
                    "http://demos.telerik.com/kendo-ui/content/web/tabstrip/ajax/ajaxContent1.html",
                    null
                ]
            });
        }
    });

    function readAjaxFn(options) {
        $.ajax({
            url: PHP_GET_FILENAME,
            type: 'GET',
            dataType: "json",
            data: {client: iCabz.client_name},
            success: function (result) {
                if (result["fn_status"] === "t") {
                    options.success(result.data);

                    // Check if the provided client has been found
                    if (iCabz.client_name.length && !result["client_id"]) {
                        $(".k-grid-add").prop("disabled", true);
                        alert("Client not found.");
                        return;
                    } else {
                        $(".k-grid-add").prop("disabled", false);
                        iCabz.default_client_id = result["client_id"];
                    }

                    if (iCabz.client_name) {
                        document.title += ": " + iCabz.client_name;
                    }

                    if(!result.data.length) {
                        alert("No records found.");
                    }
                } else {
                    $("#crud-grid").data('kendoGrid').cancelChanges();
                    alert("The server returned an error.\n" + result["fn_message"]);
                }
            },
            error: function (result) {
                options.error(result);
            }
        });
    }

    function updateAjaxFn(options) {
        var data = {};
        $.extend(data, options.data);

         // numbers
         dps.normalizeNumbers(data, [
            "total_loan_amount"
                ]);


        // timestamps
        dps.normalizeTimestamps(data, [
            "createdate"
        ]);

        $.ajax({
            url: PHP_INSUPD_FILENAME,
            type: 'POST',
            dataType: "json",
            data: data,
            success: function (result) {
                console.log(options);
                if (result["fn_status"] === "t" ) {
                    console.log("Update Success ", result);
                    //options.success();
                    $('.k-first').addClass('k-state-selected');
                    $('#PropertyTab').trigger('click')
                    
                } else {
                    console.log("Update Error ", result);
                    $("#crud-grid").data('kendoGrid').cancelChanges();
                    alert("The server returned an error.\n" + result["fn_message"]);
                }
            },
            error: function (result) {
                // notify the data source that the request failed
                console.log("Update Error ", result);
                options.error(result);
            }
        });
    }

    function createAjaxFn(options) {
        var data = {};
        $.extend(data, options.data);

         // numbers
         dps.normalizeNumbers(data, [
            "total_loan_amount"
                ]);


        // timestamps
        dps.normalizeTimestamps(data, [
            "createdate"
        ]);
        
        dps.normalizeTimestamps(data, [
            "propcreatedate"
        ]);
        $.ajax({
            url: PHP_INSUPD_FILENAME,
            type: 'POST',
            dataType: "json",
            data: data,
            success: function (result) {
                console.log(options);
                if (result["fn_status"] === "t" ) {
                    console.log("Insert Success ", result);
                    var model = $.extend({}, options.data, {id: result.new_id});
                    options.success(model);
                   document.cookie = "caseid="+result.new_id;
                } else {
                    console.log("Insert Error ", result);
                    $("#crud-grid").data('kendoGrid').cancelChanges();
                    alert("The server returned an error.\n" + result["fn_message"]);
                }
            },
            error: function (result) {
                // notify the data source that the request failed
                console.log("Create Error ", result);
                options.error(result);
            }
        });
    }

    function showEdit(e) {
        var dataItem = e;

        $.ajax(PHP_GET_FILENAME, {
            type: 'GET',
            dataType: "json",
            data: {id: dataItem.id},
            success: function (result) {
                var resData = result.data[0];

                if (result["fn_status"] === "t") {
                    var dataSource = $crudGrid.data("kendoGrid").dataSource;
                    var dataSourceRow = dataSource.getByUid(dataItem.uid);
                    $.extend(dataSourceRow, resData);
                    dataSource.data(dataSource.data());
                    $crudGrid.data("kendoGrid").editRow(dataItem);
                    kendo.ui.progress($("body"), false);

                    $('tbody>tr[data-uid='+dataItem.uid+']').addClass('k-state-selected');
                    
                    // Load data into the Applicants tab
                    var $appgrid = $("#applicantsGrid").kendoGrid({
                        columns: [
                            {field: "title", title: "Title"},
                            {field: "first_name", title: "First Name"},
                            {field: "surname", title: "Surname"},
                            {field: "addressnumber", title: "Address Number"},
                            {field: "street1", title: "Street1"},
                            {field: "street2", title: "Street2"},
                            {field: "city", title: "City"},
                            {field: "postcode", title: "Postcode" ,hidden: true},
                            {field: "country", title: "Country", hidden: true},
                            {field: "date_of_birth", title: "Date of Birth", hidden: true},
                            {field: "national_security_number", title: "National Security Number", hidden: true},
                            {field: "credit_rating", title: "Credit Rating",hidden: true},
                            {field: "telnumber", title: "Tel Number",hidden: true},
                            {field: "email", title: "Email",hidden: true},
                            {field: "time_at_address", title: "Time at Address", hidden: true},
                            {field: "employed", title: "Employed",hidden: true},
                            {field: "yearly_earnings", title: "Yearly Earnings",hidden: true},
                            {field: "monthly_outgoings", title: "Monthly Outgoings",hidden: true},
                            {field: "status", title: "Status"},
                            {field: "case_id", title: "Case Id",hidden: true},
                            
                            {command: [{name: "edit", className: "action-btn"}],
                                attributes: {style: "text-align: center;"}, width: "170px"}
                        ],
                        scrollable: false,
                        height: 310,
                        editable: "inline",
                        dataSource: dataSource,
                        toolbar: ["create"],
                        edit: function(e){
                            //if (!e.model.isNew()) {
                                //e.container.find("input[name=application_name]").prop("disabled", true);
                                //e.container.find("input[name=page_name]").data("kendoDropDownList").enable(false);
                                //e.container.find("input[name=permission]").focus();
                            //}
                        },
                        dataSource: {
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                        id: {type: "string", defaultValue: "0"},
                                        client_id: {type: "number", defaultValue: "0"},
                                        broker_id: {type: "number", defaultValue: "0"},
                                        case_id: {type: "number", defaultValue: resData.id},
                                        title: {type: "string",defaultValue: null},
                                        first_name: {type: "string", defaultValue: null},
                                        surname: {type: "string", defaultValue: null},
                                        addressnumber: {type: "string",defaultValue: null},
                                        street1: {type: "string",defaultValue: null},
                                        street2: {type: "string",defaultValue: null},
                                        city: {type: "string",defaultValue: null},
                                        postcode: {type: "string",defaultValue: null},
                                        country: {type: "string",defaultValue: null},
                                        date_of_birth: {type: "date", defaultValue: null},
                                        national_security_number: {type: "string", defaultValue: null},
                                        credit_rating: {type: "string", defaultValue: null},
                                        telnumber: {type: "string", defaultValue: null},
                                        email: {type: "string", defaultValue: null},
                                        time_at_address: {type: "number", defaultValue: "0"},
                                        employed: {type: "boolean",parse: dps.parseBool},
                                        yearly_earnings: {type: "number", defaultValue: "0"},
                                        monthly_outgoings: {type: "number", defaultValue: "0"},
                                        status: {type: "string", defaultValue: null}
                                    }
                                }
                            },
                            transport: {
                                read: function(options) {
                                    // The data is already here
                                    console.log("Read", result.applicationdata);
                                    options.success(result.applicationdata);
                                },
                                create: function(options) {
                                    var data = {mode: "create"};
                                    $.extend(data, options.data);
                                     data.date_of_birth = kendo.stringify(data.date_of_birth);
                                      dps.normalizeNumbers(data, [
                                        "time_at_address",
                                        "yearly_earnings",
                                        "monthly_outgoings"
                                            ]);
                                    $.ajax({
                                        url: PHP_INSUPD_APPLICATION_FILENAME,
                                        type: 'POST',
                                        dataType: "json",
                                        data: data,
                                        success: function(result) {
                                            console.log(options);
                                            if (result["fn_status"] === "t" ) {
                                                console.log("Insert Success ", result);
                                                var model = $.extend({}, options.data, {id: result.new_id});
                                                //var model = $.extend({}, options.data,
                                                //    {composite_pk: data.application_name + "x" + data.role_name + "x" + data.page_name});
                                                options.success(model);
                                            } else {
                                                console.log("Insert Error ", result);
                                                $("#applicantsGrid").data('kendoGrid').cancelChanges();
                                                alert("The server returned an error.\n" + result["fn_message"]);
                                            }
                                        },
                                        error: function(result) {
                                            console.log("Create Error ", result);
                                            options.error(result);
                                        }
                                    });
                                },
                                update: function(options) {
                                    var data = {mode: "update"};
                                    $.extend(data, options.data);
                                    dps.normalizeTimestamps(data, [
                                        "date_of_birth"
                                    ]);
                                    $.ajax({
                                        url: PHP_INSUPD_APPLICATION_FILENAME,
                                        type: 'POST',
                                        dataType: "json",
                                        data: data,
                                        success: function(result) {
                                            console.log(options);
                                            if (result["fn_status"] === "t" ) {
                                                console.log("Update Success ", result);
                                                options.success();
                                            } else {
                                                console.log("Update Error ", result);
                                                $("#applicantsGrid").data('kendoGrid').cancelChanges();
                                                alert("The server returned an error.\n" + result["fn_message"]);
                                            }
                                        },
                                        error: function(result) {
                                            console.log("Update Error ", result);
                                            options.error(result);
                                        }
                                    });
                                }
                            }
                        }
                    });
					
					//mortgage grid
					var $appgrid = $("#productGrid").kendoGrid({
                        columns: [
							{field: "description", title: "Description"},
							{field: "product_code", title: "Product Code"},
                           // { command: { text: "View Details", click: showDetails }, title: " ", width: "180px"},
                        ],
                        scrollable: false,
                        height: 310,
                        dataSource: dataSource,
                        dataSource: {
                            schema: {
                                model: {
                                    id: "id",
                                    fields: {
                                       id: {type: "string", defaultValue: "0"},
										client_id: {type: "number"},
										description: {type: "string"},
										product_code: {type: "string"},
										availability: {type: "string"},
										broker_restricted: {type: "boolean", parse: dps.parseBool},
										startdate: {type: "date", defaultValue: null},
										enddate: {type: "date", defaultValue: null},
										status: {type: "string"},
										tranche_size: {type: "number"},
										type: {type: "string"},
										minloanamount: {type: "number"},
										maxloanamount: {type: "number"},
										minterm: {type: "number"},
										maxterm: {type: "number"},
										maxltv: {type: "number"},
										mindeposit: {type: "number"},
										createdate: {type: "date"}
                                    }
                                }
                            },
                            transport: {
                                read: function(options) {
                                    // The data is already here
                                    console.log("Read", result.mortgagedata);
                                    options.success(result.mortgagedata);
                                },
                              
                            }
                        }
                    });
                    var dstest="";
                } else {
                    alert("The server returned an error.\n" + result["fn_message"]);
                }
            },
            error: function (result) {
                console.log("Error: ", result);
                kendo.ui.progress($("body"), false);
            }
        });
    }
        function abc(){
            alert("shoaib");
        }
    $("#txtSearch").keyup(function () {
        $filter = [];
        $x = $("#txtSearch").val();
        if ($x) {
            $filter.push({field: "customer_surname", operator: "contains", value: $x});
        }
        $crudGrid.data("kendoGrid").dataSource.filter($filter);
    });
});
