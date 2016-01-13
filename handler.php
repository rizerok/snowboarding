<?
  require('mysql.php');
  foreach($_POST as $key => $str){
    $_POST[$key] = strip_tags(htmlspecialchars(trim($str)));
  }
  $mysqli = new mysqli(MYSQL_HOST,MYSQL_USERNAME,MYSQL_PASSWORD,MYSQL_DB);
  /* проверка соединения */
  if ($mysqli->connect_errno) {
      printf("Не удалось подключиться: %s\n", $mysqli->connect_error);
      exit();
  }
  if ($mysqli->query("INSERT INTO requests (name,email,phone,city,comment,trainer) VALUES (".
      "'".$_POST['lead-name']."',".
      "'".$_POST['lead-email']."',".
      "'".$_POST['lead-phone']."',".
      "'".$_POST['lead-city']."',".
      "'".$_POST['lead-comment']."',".
      "'".$_POST['trainer']."'".
      ")") === TRUE) {
      printf("good");
  }
  $mysqli->close();
?>