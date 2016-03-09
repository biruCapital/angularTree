<?php

/*
  insupd_Mortgage_cases.php
  Note: This script was created by R A Axford and is the property of R A Axford.
  Any changes or modifications, other than by authorised employees of R A Axford
  will negate any support obligations that exist in regard to this location solution,
  implied or contractually intended. R A Axford will not be responsible for any portion of
  the location system in the event of any change whatsoever.
  This procedure and its contents are conidered a trade secret and a copyright of R A Axford and as such
  are strictly confidential. For further information contact: alan@axford.com
 */

header('Content-type: application/json');
include ('../common/geofence.php');

// all fields for the stored procedure are past as POST arguments
$id = filter_input(INPUT_POST, 'id');
$client_id = filter_input(INPUT_POST, 'client_id');
$broker_id = filter_input(INPUT_POST, 'broker_id');
$reference = filter_input(INPUT_POST, 'reference');
$customer_surname = filter_input(INPUT_POST, 'customer_surname');
$total_loan_amount = filter_input(INPUT_POST, 'total_loan_amount');
$status = filter_input(INPUT_POST, 'status');
$sales_id = filter_input(INPUT_POST, 'sales_id');
$createdate = filter_input(INPUT_POST, 'createdate');

// all fields for the stored procedure are past as POST arguments
$propid = filter_input(INPUT_POST, 'propid');
$propclient_id = filter_input(INPUT_POST, 'propclient_id');
$propcase_id = filter_input(INPUT_POST, 'propcase_id');
$proploan_amount = filter_input(INPUT_POST, 'proploan_amount');
$propproperty_value = filter_input(INPUT_POST, 'propproperty_value');
$propaddressnumber = filter_input(INPUT_POST, 'propaddressnumber');
$propstreet1 = filter_input(INPUT_POST, 'propstreet1');
$propstreet2 = filter_input(INPUT_POST, 'propstreet2');
$propcity = filter_input(INPUT_POST, 'propcity');
$proppostcode = filter_input(INPUT_POST, 'proppostcode');
$propfurther_advance = filter_input(INPUT_POST, 'propfurther_advance');
$propremortgage = filter_input(INPUT_POST, 'propremortgage');
$propexsisting_monthly_payments = filter_input(INPUT_POST, 'propexsisting_monthly_payments');
$propexsisting_mortgage_balance = filter_input(INPUT_POST, 'propexsisting_mortgage_balance');
$propfinancial_difficultied = filter_input(INPUT_POST, 'propfinancial_difficultied');
$proptype_of_mortgage = filter_input(INPUT_POST, 'proptype_of_mortgage');
$propcreatedate = filter_input(INPUT_POST, 'propcreatedate');

// Convert empty numeric, date or timestamp values to proper NULLs
if ($total_loan_amount === "null") { $total_loan_amount = NULL; }
if ($createdate === "null") { $createdate = NULL; }


// Convert empty numeric, date or timestamp values to proper NULLs
if ($proploan_amount === "null") { $proploan_amount = NULL; }
if ($propproperty_value === "null") { $propproperty_value = NULL; }
if ($propexsisting_monthly_payments === "null") { $propexsisting_monthly_payments = NULL; }
if ($propexsisting_mortgage_balance === "null") { $propexsisting_mortgage_balance = NULL; }
if ($propcreatedate === "null") { $propcreatedate = NULL; }
if ($propid == "") { $propid = "0"; }
if ($propfinancial_difficultied == "") { $propfinancial_difficultied = "false"; }
if ($propremortgage == "") { $propremortgage = "false"; }
if ($propfurther_advance == "") { $propfurther_advance = "false"; }
if ($propcreatedate == "") {$propcreatedate = date("Y-m-d h:i:s"); }
// get connection details from geofence
sqlconnection($server, $user, $pwd);
$db = "docprod";
$con1 = pg_connect("host=$server dbname=$db user=$user password=$pwd")
        or exit(json_encode(array("fn_message" => "Cannot connect to the database",
            "fn_status" => "f")));

 //build the sql string
$sqlstr = <<<LABEL
select * from docprod.fn_insupd_mortgage_cases($1, $2, $3, $4, $5, $6, $7, $8, $9);
LABEL;

$opresult = pg_query_params($con1, $sqlstr, array(
    $id, $client_id, $broker_id, $reference, $customer_surname, $total_loan_amount, $status, $sales_id, $createdate
    ));
    
   
if (!$opresult) {
    $return = array("fn_message" => pg_last_error() . "\n" . $sqlstr,
        "fn_status" => "f");
} else {
    $tmp = pg_fetch_object($opresult);
    $return = array("fn_message" => $tmp->fn_message, "fn_status" => $tmp->fn_status, "new_id" => $tmp->new_id);
}
pg_close($con1);

// get connection details from geofence
sqlconnection($server, $user, $pwd);
$db = "docprod";
$con1 = pg_connect("host=$server dbname=$db user=$user password=$pwd")
        or exit(json_encode(array("fn_message" => "Cannot connect to the database",
            "fn_status" => "f")));

// build the sql string
$sqlstr = <<<LABEL
select * from docprod.fn_insupd_property_details($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
LABEL;

$opresult = pg_query_params($con1, $sqlstr, array($propid, $propclient_id, $propcase_id, $proploan_amount, $propproperty_value, $propaddressnumber, $propstreet1, $propstreet2, $propcity, $proppostcode, $propfurther_advance, $propremortgage, $propexsisting_monthly_payments, $propexsisting_mortgage_balance, $propfinancial_difficultied, $proptype_of_mortgage, $propcreatedate));
if (!$opresult) {
    $return = array("fn_message" => pg_last_error() . "\n" . $sqlstr,
        "fn_status" => "f");
} else {
    $tmp = pg_fetch_object($opresult);
    $return = array("fn_message" => $tmp->fn_message, "fn_status" => $tmp->fn_status, "new_id" => $tmp->new_id);
}

pg_close($con1);

echo json_encode($return);
?>
