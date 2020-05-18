const xapi = require('xapi');

const hue_AccessToken = '0123456789ABCDEF0123456789ABCDEF01234567'; /* Access token, 40 digit hex string - see https://developers.meethue.com */
const hue_Server = '10.1.1.100'; /* IP of Hue bridge */
const hue_idx_office = 9; /* Index of office ceiling light group - find via https://<bridge ip>/api/<token>/groups */
const hue_idx_sign = 4; /* Index of 'in call' indicator group */

const HTTP_TIMEOUT = 1; /* How fast (in seconds) the HTTP rest commands should fail with timeout error. */

function _hue_put(hue_idx, command) {
  console.log(command);
  xapi.command('HttpClient Put', {
    Url: 'https://' + hue_Server + "/api/" +hue_AccessToken + "/groups/" + hue_idx + "/action",
    AllowInsecureHTTPS: 'True'
  }, JSON.stringify(command))
  .catch((err) => {
    console.log(err);
  });
}

function init(){
  xapi.config.set('HttpClient Mode', 'On'); //this needs to be set to on to allow HTTP Post
  xapi.config.set('HttpClient AllowInsecureHTTPS', 'True'); //this needs to be set to on to work with self-signed cert
  console.log( "Debug: init" );

xapi.event.on('CallDisconnect', (event) => {
      console.log('Debug: CallDisconnect');
      _hue_put(hue_idx_sign,{"on":false, "sat":254, "bri":96,"hue":21845});
});

xapi.status.on('Call RemoteNumber', (remoteNumber) => {
      console.log('Debug: Call RemoteNumber');
      _hue_put(hue_idx_sign,{"on":true, "sat":254, "bri":96,"hue":0});
});

  /* Event listeners for manual light controls from the touch panel */
 xapi.event.on('UserInterface Extensions Widget Action', (event) => {
   if ((event.Type === 'released') && (event.WidgetId === "hue_slider")) { // needs testing
   console.log('Debug: slider');
//   console.log (event.Type );
//   console.log (event.WidgetId );
//   console.log (parseInt(event.Value)+230 );
   _hue_put(hue_idx_office,'{"on":true, "bri":'+event.Value+'}');
   }
   if (event.Type === 'clicked') {
   switch (event.WidgetId) {
     case 'hue_day':
      console.log('Debug: day');
      _hue_put(hue_idx_office,{"on":true, "bri":254, "ct":225});
      break;
     case 'hue_cool':
      console.log('Debug: cool');
      _hue_put(hue_idx_office,{"on":true, "bri":254, "ct":300});
      break;
     case 'hue_warm':
      console.log('Debug: warm');
      _hue_put(hue_idx_office,{"on":true, "bri":254, "ct":375});
      break;
     case 'hue_candle':
      console.log('Debug: candle');
      _hue_put(hue_idx_office,{"on":true, "bri":254, "ct":450});
      break;
     case 'hue_100':
      console.log('Debug: 100%');
      _hue_put(hue_idx_office,{"on":true, "bri":254});
      break;
     case 'hue_66':
      console.log('Debug: 66%');
      _hue_put(hue_idx_office,{"on":true, "bri":167});
      break;
     case 'hue_33':
      console.log('Debug: 33%');
      _hue_put(hue_idx_office,{"on":true, "bri":83});
      break;
     case 'hue_on':
      console.log('Debug: on');
      _hue_put(hue_idx_office,{"on":true});
      break;
     case 'hue_off':
      console.log('Debug: off');
      _hue_put(hue_idx_office,{"on":false});
      break;
      case 'traffic_green':
       console.log('Debug: traffic_green');
       _hue_put(hue_idx_sign,{"on":true, "sat":254, "bri":96,"hue":21845});
      break;
      case 'traffic_yellow':
       console.log('Debug: traffic_yellow');
       _hue_put(hue_idx_sign,{"on":true, "sat":254, "bri":96,"hue":7100});
      break;
      case 'traffic_red':
       console.log('Debug: traffic_red');
       _hue_put(hue_idx_sign,{"on":true, "sat":254, "bri":96,"hue":0});
      break;
      case 'traffic_off':
       console.log('Debug: traffic_off');
       _hue_put(hue_idx_sign,{"on":false});
      break;
        
    }
   }
  });
}


init();