import React from "react";
import {useParams} from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
const RoomPage=()=>{
    const{roomId}=useParams();
    const myMeeting = async (element) => {
    const appID = 864286617;
      const serverSecret = "badad0532db619766ad08d4702b7b6c3";
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId,Date.now().toString(),"alok");
      const zc=ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: element,
        sharedLinks: [
            {
              name: 'Personal link',
              url:
               window.location.protocol + '//' + 
               window.location.host + window.location.pathname +
                '?roomID=' +
                roomId,
            },
          ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    }
    return (
  
         <div>
            <div ref={myMeeting}/>
        </div>
      
       
    )
}
export default RoomPage;