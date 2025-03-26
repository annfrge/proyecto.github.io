<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

ini_set('display_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json;charset=UTF-8'); 

function limpiarInput($campo) {
    if(empty($campo)){
        echo json_encode(["success" => false, "message" => "Campo vacío"]);
        exit;
    }
    return htmlspecialchars(strip_tags(trim($campo)), ENT_QUOTES, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    $recaptcha_secret = '****'; 

    if (!isset($_POST['recaptcha_response']) || empty($_POST['recaptcha_response'])) {
        echo json_encode(["success" => false, "message" => "Fallo en reCAPTCHA"]);
        exit;
    }
     $recaptcha_response = $_POST['recaptcha_response'];
    $recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
    $recaptcha = json_decode($recaptcha);

    if ($recaptcha->score < 0.7) {
        echo json_encode(["success" => false, "message" => "Eres un bot"]);
        exit;
    }

    $campos = array_map("limpiarInput", $_POST);

    if (!filter_var($campos["email"], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => " El formato del Email es inválido, intenta: example@gmail.com"]);
        exit;
    }

    if (!preg_match("/^(\+34\s?|34\s?|0)?[6789]\d{2}(\s?\d{3}){2}$/", $campos["tel"])) {
        echo json_encode(["success" => false, "message" => " El formato del teléfono es inválido."]);
        exit;
    }

    if (empty($campos["message"])) {
        echo json_encode(["success" => false, "message" => " El mensaje no puede estar vacío."]);
        exit;
    }

    $mail = new PHPMailer(true);

        try {
                      
        $mail->isSMTP();                                          
        $mail->Host       = 'smtp.gmail.com';                      
        $mail->SMTPAuth   = true;                                 
        $mail->Username   = 'annfrge@gmail.com';         
        $mail->Password   = '****';                
        $mail->SMTPSecure = 'ssl';                                 
        $mail->Port       = 465;                                 

        $emailFrom = $campos["email"];
        $nameFrom = $campos["nombre"];
        $telFrom = $campos["tel"];
        $message = nl2br($campos["message"]);

        $mail->setFrom('annfrge@gmail.com', 'Ana Gamarra'); 
        $mail->addAddress('annfrge@gmail.com', 'Ana Gamarra');  

        //Content
        $mail->isHTML(true);                                
        $mail->Subject = 'Formulario de contacto www.achoCoffee.com';
        $mail->Body    ="<strong>Nombre:</strong> $nameFrom<br>
                              <strong>Email:</strong> $emailFrom<br>
                              <strong>Teléfono:</strong> $telFrom<br>
                              <strong>Mensaje:</strong> $message";
        $mail->send();
        
        echo json_encode(["success" => true, "message" => "El formulario ha sido enviado correctamente."]);
        
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Error en el envío: " . $mail->ErrorInfo]);
        }
        exit;

          
} else {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Acceso denegado"]);
    exit;
}

?>