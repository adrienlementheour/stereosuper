<?

  //  Notis version 1.0
  // (c) Boris Forconi 2005
  
  class Mail 
  { 
      var $sendto= array(); 
      var $from, $msubject; 
      var $acc= array(); 
      var $abcc= array(); 
      var $aattach= array(); 
      var $priorities= array( '1 (Highest)', '2 (High)', '3 (Normal)', '4 (Low)', '5 (Lowest)' ); 
    
      // Mail contructeur
    
      function Mail() 
      { 
              $this->autoCheck( true ); 
      } 
    
       
      function autoCheck( $bool ) 
      { 
              if( $bool ) 
                      $this->checkAddress = true; 
              else 
                      $this->checkAddress = false; 
      } 
    
    
      function Subject( $subject ) 
      { 
              $this->msubject = strtr( $subject, "\r\n" , " " ); 
      } 
    
        
      function From( $from ) 
      { 
        
              if( ! is_string($from) ) { 
                      echo "Class Mail: error, From is not a string"; 
                      exit; 
              } 
              $this->from= $from; 
      } 
    
      function To( $to ) 
      { 
        
              // TODO : test validit� sur to 
              if( is_array( $to ) ) 
                      $this->sendto= $to; 
              else 
                      $this->sendto[] = $to; 
        
              if( $this->checkAddress == true ) 
                      $this->CheckAdresses( $this->sendto ); 
        
      } 
    
      function Cc( $cc ) 
      { 
              if( is_array($cc) ) 
                      $this->acc= $cc; 
              else 
                      $this->acc[]= $cc; 
        
              if( $this->checkAddress == true ) 
                      $this->CheckAdresses( $this->acc ); 
        
      } 
    
      function Bcc( $bcc ) 
      { 
              if( is_array($bcc) ) { 
                      $this->abcc = $bcc; 
              } else { 
                      $this->abcc[]= $bcc; 
              } 
        
              if( $this->checkAddress == true ) 
                      $this->CheckAdresses( $this->abcc ); 
      } 
       
      function Body( $body ) 
      { 
              $newBod = str_replace("�","'",$body);
             // $newBod = str_replace('\r\n','\n',$newBod);
              $this->body= $newBod; 
      } 
    
      function Send() 
      { 
              // build the headers 
              $this->_build_headers(); 
        
              // include attached files 
              if( sizeof( $this->aattach > 0 ) ) { 
                      $this->_build_attachement(); 
                      $body = $this->fullBody . $this->attachment; 
              } 
        
              // envoie du mail aux destinataires principal 
              for( $i=0; $i< sizeof($this->sendto); $i++ ) { 
                      $res = mail($this->sendto[$i], $this->msubject,$body, $this->headers); 
                      // TODO : trmt res 
              } 
        
      } 
    
      function Organization( $org ) 
      { 
              if( trim( $org != "" ) ) 
                      $this->organization= $org; 
      } 
    
      function Priority( $priority ) 
      { 
        
              if( ! intval( $priority ) ) 
                      return false; 
        
              if( ! isset( $this->priorities[$priority-1]) ) 
                      return false; 
        
              $this->priority= $this->priorities[$priority-1]; 
        
              return true; 
        
      } 
    
      function Attach( $filename, $filetype='application/x-unknown-content-type', $disposition = "inline" ) 
      { 
              // TODO : si filetype="", alors chercher dans un tablo de MT connus / extension du fichier 
              $this->aattach[] = $filename; 
              $this->actype[] = $filetype; 
              $this->adispo[] = $disposition; 
      } 
    
      function Get() 
      { 
              $this->_build_headers(); 
              if( sizeof( $this->aattach > 0 ) ) { 
                      $this->_build_attachement(); 
                      $this->body= $this->body . $this->attachment; 
              } 
              $mail = $this->headers; 
              $mail .= "\n$this->body"; 
              return $mail; 
      } 
    
      function ValidEmail($address) 
      { 
              if( ereg( ".*<(.+)>", $address, $regs ) ) { 
                      $address = $regs[1]; 
              } 
               if(ereg( "^[^@ ]+@([a-zA-Z0-9\-]+\.)+([a-zA-Z0-9\-]{2}|net|com|gov|mil|org|edu|int)\$",$address) ) 
                       return true; 
               else 
                       return false; 
      } 
    
      function CheckAdresses( $aad ) 
      { 
              for($i=0;$i< sizeof( $aad); $i++ ) { 
                      if( ! $this->ValidEmail( $aad[$i]) ) { 
                              echo "Class Mail, method Mail : invalid address $aad[$i]"; 
                              exit; 
                      } 
              } 
      } 
       
      function _build_headers() 
      { 
        
              // creation du header mail 
              $this->headers= "From: $this->from\n"; 
        
              $this->to= implode( ", ", $this->sendto ); 
        
              if( count($this->acc) > 0 ) { 
                      $this->cc= implode( ", ", $this->acc ); 
                      $this->headers .= "CC: $this->cc\n"; 
              } 
        
              if( count($this->abcc) > 0 ) { 
                      $this->bcc= implode( ", ", $this->abcc ); 
                      $this->headers .= "BCC: $this->bcc\n"; 
              } 
        
              /*if( $this->organization != "" ) 
                      $this->headers .= "Organization: $this->organization\n"; 
        
              if( $this->priority != "" ) 
                      $this->headers .= "X-Priority: $this->priority\n"; */
        
      } 

      function _build_attachement() 
      { 
              $this->boundary= "------------" . md5( uniqid("myboundary") ); // TODO : variable bound 
        
              $this->headers .= "MIME-Version: 1.0\nContent-Type: multipart/mixed;\n boundary=\"$this->boundary\"\n"; 
              $this->fullBody = "This is a multi-part message in MIME format.\n--$this->boundary\nContent-Type: text/html; Content-Transfer-Encoding: 7bit\n" . stripslashes($this->body) ."\n"; 
              $sep= chr(13) . chr(10); 
        
              $ata= array(); 
              $k=0; 
        
              // for each attached file, do... 
              for( $i=0; $i < sizeof( $this->aattach); $i++ ) { 
        
                      $filename = $this->aattach[$i]; 
                      $basename = basename($filename); 
                      $ctype = $this->actype[$i]; // content-type 
                      $disposition = $this->adispo[$i]; 
        
                      if( ! file_exists( $filename) ) { 
                              echo "Class Mail, method attach : file $filename can't be found"; exit; 
                      } 
                      $subhdr= "--$this->boundary\nContent-type: $ctype;\n name=\"$basename\"\nContent-Transfer-Encoding: base64\nContent-Disposition: $disposition;\n filename=\"$basename\"\n"; 
                      $ata[$k++] = $subhdr; 
                      // non encoded line length 
                      $linesz= filesize( $filename)+1; 
                      $fp= fopen( $filename, 'r' ); 
                      $data= base64_encode(fread( $fp, $linesz)); 
                      fclose($fp); 
                      $ata[$k++] = chunk_split( $data ); 
             } 
             $this->attachment= implode($sep, $ata); 
       } 
  }
  
  function validEmail($email_adresse) {
  		if (!ereg('^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+'.
                '@'.
                '[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.'.
                '[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$', $email_adresse)) 
      {
          return false;
      } else {
         return true;
      }
  }
?>
