<?php
//access_token
$appid="";//小程序id
$secret="";//密钥
$grant_type="client_credential";
$access_token=curl_get("https://api.weixin.qq.com/cgi-bin/token?appid=$appid&secret=$secret&grant_type=$grant_type");
echo $access_token;
function curl_get($url){

    $header = array(
        'Accept: application/json',
    );
    $curl = curl_init();
    //设置抓取的url
    curl_setopt($curl, CURLOPT_URL, $url);
    //设置头文件的信息作为数据流输出
    curl_setopt($curl, CURLOPT_HEADER, 0);
    // 超时设置,以秒为单位
    curl_setopt($curl, CURLOPT_TIMEOUT, 1);

    // 超时设置，以毫秒为单位
    // curl_setopt($curl, CURLOPT_TIMEOUT_MS, 500);

    // 设置请求头
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    //设置获取的信息以文件流的形式返回，而不是直接输出。
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    //执行命令
    $data = curl_exec($curl);

    // 显示错误信息
    if (curl_error($curl)) {
        print "Error: " . curl_error($curl);
    } else {
        $result=json_decode($data,true);
        //  $ACCESS_TOKEN=$result['access_token'];
        curl_close($curl);//关闭连接
        print "Success: " . $result['access_token'];
          return $result['access_token'];
        // //存入到redis
// // 如果未修改php.ini下面两行注释去掉
//        ini_set('session.save_handler', 'redis');
//        ini_set('session.save_path', 'tcp://127.0.0.1:6379');
//        $redis = new redis();
//        $redis->connect('127.0.0.1', 6379);
//        $redis->set('kuaiquyin_wx_token',$result['access_token']);
//        echo $redis->get('kuaiquyin_wx_token');
    }
}
?>
