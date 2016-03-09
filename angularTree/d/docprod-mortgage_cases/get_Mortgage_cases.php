<?php

header('Content-type: application/json');

include ('../common/geofence.php');

$id = filter_input(INPUT_GET, 'id');
$client = filter_input(INPUT_GET, 'client');

// get connection details from geofence
sqlconnection($server, $user, $pwd);
$db = "docprod";
$con1 = pg_connect("host=$server dbname=$db user=$user password=$pwd")
        or exit(json_encode(array("fn_message" => "Cannot connect to the database",
            "fn_status" => "f")));

$client_id = 0;

if (strlen($id) > 0) {
    // Select data for the Details form
    $sqlquery = "select a.id,a.client_id, a.broker_id, a.reference, a.customer_surname, a.total_loan_amount, a.status, a.sales_id, a.createdate, a.last_updated,b.id as propid,b.client_id as propclient_id, a.id as propcase_id, b.loan_amount as proploan_amount, b.property_value propproperty_value, b.addressnumber as propaddressnumber, b.street1 as propstreet1, b.street2 as propstreet2, b.city propcity, b.postcode proppostcode, b.further_advance as propfurther_advance, b.remortgage as propremortgage, b.exsisting_monthly_payments as propexsisting_monthly_payments, b.exsisting_mortgage_balance as propexsisting_mortgage_balance,b.financial_difficultied as propfinancial_difficultied, b.type_of_mortgage as proptype_of_mortgage, b.createdate as propcreatedate,b.last_updated as proplast_updated from docprod.mortgage_cases a left join docprod.property_details b on a.id = b.case_id where a.id = $id;";
   //application tab  id appid,client_id appclient_id,broker_id appbroker_id,case_id appcase_id,title apptitle,first_name appfirst_name,surname appsurname,addressnumber appaddressnumber,street1 appstreet1,street2 appstreet2,city appcity,postcode apppostcode,country appcountry,date_of_birth appdate_of_birth,national_security_number appnational_security_number,credit_rating appcredit_rating, telnumber apptelnumber, email appemail, time_at_address apptime_at_address, employed appemployed, yearly_earnings appyearly_earnings, monthly_outgoings appmonthly_outgoings, status appstatus
    $appsql = <<<LABEL
        select * from docprod.loan_applicants where case_id = $id;
LABEL;

 $morquery = "select * from docprod.products where client_id = $client_id;";
} else {

    // Check if the client provided by the user exists
    $opresult = pg_query_params($con1,
            "select id from docprod.clients where name=$1;",
            array($client));
    if (!$opresult) {
        exit (json_encode(array("fn_message" => pg_last_error(),
            "fn_status" => "f")));
    } else {
        if (pg_affected_rows($opresult) > 0) {
            $arr = pg_fetch_array($opresult);
            $client_id = $arr["id"];
        }
    }

    $extra_clause = strlen($client) > 0 ? "where cl_name = '$client'" : "";

    // Select data for the Templates table
    $sqlquery = "select a.broker_id, a.client_id, a.customer_surname, a.id, a.reference, b.addressnumber as propaddressnumber,a.id as propcase_id, b.city as propcity, b.client_id as propclient_id, b.id as propid, b.loan_amount proploan_amount, b.postcode as proppostcode, b.property_value propproperty_value, b.street1 as propstreet1, b.street2 as propstreet2, b.type_of_mortgage as proptype_of_mortgage, b.exsisting_monthly_payments as propexsisting_monthly_payments, b.exsisting_mortgage_balance as propexsisting_mortgage_balance, b.financial_difficultied as propfinancial_difficultied, b.further_advance as propfurther_advance, b.remortgage as propremortgage, b.createdate as propcreatedate  
  from docprod.mortgage_cases a
  left join docprod.property_details b on a.id = b.case_id
  left outer join  docprod.clients cl on cl.id = a.client_id
  $extra_clause
  order by customer_surname;";

    $appresult =pg_query_params($con1,
            "select id from docprod.clients where name=$1;",
            array($client));
    if (!$appresult) {
        exit(json_encode(array("fn_message" => pg_last_error() . "\n" . $appsql,
        "fn_status" => "f" )));
    
    } else {
        if (pg_affected_rows($appresult) > 0) {
            $appData = pg_fetch_all($appresult);
            $client_id = $appData["id"];
        } else {
            $appData = array();
        }
    }
      $extra_clause = strlen($client) > 0 ? "where cl_name = '$client'" : "";
    // Page Name drop down menu
    $appsql = "select broker_id, case_id, client_id, id, surname, title
    from docprod.loan_applicants
    left outer join
    (select id as client_id, name as cl_name from docprod.clients) cl
    using(client_id)
    $extra_clause
    order by surname;";
	
	

    $extra_clause = strlen($client) > 0 ? "where cl_name = '$client'" : "";

    // Select data for the Templates table
    $morquery = "select availability, client_id, description, id, product_code
  from docprod.products
  left outer join
  (select id as client_id, name as cl_name from docprod.clients) cl
  using(client_id)
  $extra_clause
  order by product_code;";
    
	
}

$opresult = pg_query($con1, $sqlquery);

$appresult = pg_query($con1, $appsql);

$morresult = pg_query($con1, $morquery);
if (!$opresult) {
    $return = array("fn_message" => pg_last_error() . "\n" . $sqlquery,
        "fn_status" => "f" );
} else {
    if (pg_affected_rows($opresult) > 0) {
        $maindata = pg_fetch_all($opresult);
     
    } else {
        $maindata = array();
      
    }
     if (pg_affected_rows($appresult) > 0) {
        $applicationdata = pg_fetch_all($appresult);
       
    } else {
        $applicationdata = array();
      
    }
	 if (pg_affected_rows($morresult) > 0) {
        $mortgagedata = pg_fetch_all($morresult);
       
    } else {
        $mortgagedata = array();
      
    }
	
    $return = array("data" => $maindata,
             "applicationdata" => $applicationdata,
			 "mortgagedata" => $mortgagedata,
            "client_id" => $client_id,
            "fn_message" => "No records found",
            "fn_status" => "t");
}

pg_close($con1);

echo json_encode($return);
?>
