<?php
    session_start();
    $_SESSION = arrary();
    session_destroy();
    header("Location: login.php");
    exit();
?>