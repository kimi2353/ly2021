<?php
require_once  './autoload.php';
header('Access-Control-Allow-Origin:http://localhost:8080');
header('Access-Control-Allow-Headers:Accept,Referer,Host,Keep-Alive,User-Agent,X-Requested-With,Cache-Control,Content-Type,Cookie,token');
header('Access-Control-Allow-Credentials:true');
header('Access-Control-Allow-Methods:GET,POST,OPTIONS');
use Qiniu\Auth;
//$callback = $_REQUEST['callback'];
$bucket = 'static-k12edu-camprecord';
$accessKey = 'AZu4n0X_3CFhAmZUESMSgRxuzppa-eIRUwKH9MXd';
$secretKey = 'Pv8cELY2PMYZVW7VbswW1RA4Xz_uiex4D1-YUN4m';
$auth = new Auth($accessKey, $secretKey);

$upToken = $auth->uploadToken($bucket);
$ret = array('uptoken' => $upToken,'domain' => 'http://pdr24p5x0.bkt.clouddn.com');
echo json_encode($ret);