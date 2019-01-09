<?php
include_once "../conn/config.php";

class Upload{
    private $filepath = '../upload/'; //上传目录
    private $tmpPath;  //PHP文件临时目录
    private $blobNum; //第几个文件块
    private $totalBlobNum; //文件块总数
    private $fileName; //文件名
 	private $openid; //openid
    private $datatime; //时间
    private $username; //用户填写的昵称
    private $nickname; //用户微信昵称
    private $subject; //作业号
    private $classname; //作业号
 
    public function __construct($tmpPath,$blobNum,$totalBlobNum,$fileName,$openid,$time,$username,$nickname,$subject,$classname){
        $this->tmpPath =  $tmpPath;
        $this->blobNum =  $blobNum;
        $this->totalBlobNum =  $totalBlobNum;
        $this->fileName =  $openid.'_'.$time.'.mp4';
        $this->openid =  $openid;
        $this->datatime =  $time;
        $this->username =  base64_encode($username);
        $this->nickname =  base64_encode($nickname);
        $this->subject =  $subject;
        $this->classname =  base64_encode($classname);
        $this->moveFile();
        $this->fileMerge();
    }
     
    //判断是否是最后一块，如果是则进行文件合成并且删除文件块
    private function fileMerge(){
        if($this->blobNum == $this->totalBlobNum){
            $blob = '';
            for($i = 1; $i <= $this->totalBlobNum; $i++){
                $blob = file_get_contents($this->filepath.'/'. $this->fileName.'__'.$i);
                file_put_contents($this->filepath.'/'. $this->fileName,$blob,FILE_APPEND);
            }
           	$this->deleteFileBlob();
        }
    }
     
   //删除文件块
    private function deleteFileBlob(){
        for($i=1; $i<= $this->totalBlobNum; $i++){
            @unlink($this->filepath.'/'. $this->fileName.'__'.$i);
        }
    }
     
    //移动文件
    private function moveFile(){
        $this->touchDir();//.'/'. $this->openid
        $filename = $this->filepath .'/'. $this->fileName.'__'.$this->blobNum;
        move_uploaded_file($this->tmpPath,$filename);
    }
     
    //API返回数据
    public function apiReturn(){
        if($this->blobNum == $this->totalBlobNum){
            if(file_exists($this->filepath.'/'. $this->fileName)){
                $data['code'] = 2;
                $data['msg'] = 'success';
                //$data['file_path'] = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['REQUEST_URI']).str_replace('.','',$this->filepath).'/'. $this->fileName;

    //             $s = "UPDATE videoup2018 SET flag = 1 WHERE openid = '$this->openid' AND subject = '$this->subject'";
    //             mysql_query($s);

    //             $sql = "INSERT INTO videoup2018 (openid,fileName,nickname,username,subject,datatime,classname) values ('$this->openid','$this->fileName','$this->nickname','$this->username','$this->subject','$this->datatime','$this->classname')";
				// mysql_query($sql);
				mysql_close();
            }
        }else{
            if(file_exists($this->filepath.'/'. $this->fileName.'__'.$this->blobNum)){
                $data['code'] = 1;
                $data['msg'] = 'waiting for all';
                //$data['file_path'] = '';
            }
        }
        header("Content-type:text/json;charset=UTF-8");
        echo json_encode($data);
    }
     
    //建立上传文件夹
    private function touchDir(){
        if(!file_exists($this->filepath)){
            return mkdir($this->filepath);
        }
    }
}
 
//实例化并获取系统变量传参
$upload = new Upload(
    $_FILES['file']['tmp_name'],
    $_POST['blob_num'],
    $_POST['total_blob_num'],
    $_POST['file_name'],
    $_POST['openid'],
    $_POST['time'],
    $_POST['username'],
    $_POST['nickname'],
    $_POST['subject'],
    $_POST['classname']
);
//调用方法，返回结果
$upload->apiReturn();
?>