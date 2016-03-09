<?php

/*
  insupd_Loan_applicants.php
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
$case_id = filter_input(INPUT_POST, 'case_id');
$title = filter_input(INPUT_POST, 'title');
$first_name = filter_input(INPUT_POST, 'first_name');
$surname = filter_input(INPUT_POST, 'surname');
$addressnumber = filter_input(INPUT_POST, 'addressnumber');
$street1 = filter_input(INPUT_POST, 'street1');
$street2 = filter_input(INPUT_POST, 'street2');
$city = filter_input(INPUT_POST, 'city');
$postcode = filter_input(INPUT_POST, 'postcode');
$country = filter_input(INPUT_POST, 'country');
$date_of_birth = filter_input(INPUT_POST, 'date_of_birth');
$national_security_number = filter_input(INPUT_POST, 'national_security_number');
$credit_rating = filter_input(INPUT_POST, 'credit_rating');
$telnumber = filter_input(INPUT_POST, 'telnumber');
$email = filter_input(INPUT_POST, 'email');
$time_at_address = filter_input(INPUT_POST, 'time_at_address');
$employed = filter_input(INPUT_POST, 'employed');
$yearly_earnings = filter_input(INPUT_POST, 'yearly_earnings');
$monthly_outgoings = filter_input(INPUT_POST, 'monthly_outgoings');
$status = filter_input(INPUT_POST, 'status');

// Convert empty numeric, date or timestamp values to proper NULLs
if ($date_of_birth === "null") { $date_of_birth = date("Y-m-d h:i:s"); }
if ($time_at_address === "null") { $time_at_address = NULL; }
if ($yearly_earnings === "null") { $yearly_earnings = NULL; }
if ($monthly_outgoings === "null") { $monthly_outgoings = NULL; }


// get connection details from geofence
sqlconnection($server, $user, $pwd);
$db = "docprod";
$con1 = pg_connect("host=$server dbname=$db user=$user password=$pwd")
        or exit(json_encode(array("fn_message" => "Cannot connect to the database",
            "fn_status" => "f")));

// build the sql string
$sqlstr = <<<LABEL
select * from docprod.fn_insupd_loan_applicants($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23);
LABEL;
  
$opresult = pg_query_params($con1, $sqlstr, array(
    $id, $client_id, $broker_id, $case_id, $title, $first_name, $surname, $addressnumber, $street1, $street2, $city, $postcode, $country, $date_of_birth, $national_security_number, $credit_rating, $telnumber, $email, $time_at_address, $employed, $yearly_earnings, $monthly_outgoings, $status
    ));
 
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
