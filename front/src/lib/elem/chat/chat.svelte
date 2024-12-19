<!-- url du compo: https://pagedone.io/docs/chat-bubble -->

<script lang="ts">
	import { Chat_c } from "@/type/shared_type/chat";
  import RtCcall from "./RTCcall.svelte";
	import { app } from "../../../store/appStore";
	import { send_msg, sendVocalMsg } from "../../../store/socketStore";
	import { us } from "../../../store/userStore";
	import Msg from "./msg.svelte";
	import { type MsgInput_t } from "@/type/shared_type/msg";
	import { onDestroy, onMount } from "svelte";

  export let chat: Chat_c; // fakeChat//
  export let matchOrChat: Boolean;
  let msgContent = "";
  let mediaRecorder : MediaRecorder | null;
  let audio: HTMLAudioElement | null = null;
  let audioChunks: Blob[] = [];
  let audioUrl: string = "";
  let unsubscribe: () => void;

  onMount(()=> {
    audio = new Audio();

    $app.userViewingChat = chat.id;
    console.log($app.userViewingChat);

    // unsubscribe = soc.subscribe((s) => {
    //   if (s.msg) {
    //     chat.msg = [...chat.msg, s.msg]; // Ajoute le nouveau message à la liste
    //   }
    // });
    // return () => {
    //   if (unsubscribe)
    //     unsubscribe(); // Nettoyage de l'abonnement
    // };
  })

  onDestroy(() => {
    $app.userViewingChat = null;
  });

  function sendMsg(_msg: string) {
    // send_msg(_msg);
    console.log(`dans Send Msg`);
    const newMsg: MsgInput_t = {
      chatId: chat.id,
      userId: $us.user.id,
      destId: chat.interlocutors.find(e => e.id !== $us.user.id)?.id, //chat.interlocutor?.id, // Pour test PROBLEM 
      content: _msg
    };
    console.log(`newMsg`, newMsg);
    newMsg.content = newMsg.content.trim();
    if (newMsg.content){
      send_msg(newMsg);
      chat.msg.push(newMsg);
    }
    msgContent = "";
    chat = chat;
  }

  async function record() {
    console.log(`Record`, );
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    audioChunks = []

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

      // POUR FAIRE JOUER LE MORCEAUX SUR UN HTMLAUDIOELEMENT
      audioUrl = URL.createObjectURL(audioBlob);
      // document.getElementById('audioPlayback').src = audioUrl;
      
      // audio = new Audio(audioUrl);
      if (audio) {
        audio.src = audioUrl;
        audio.play().catch(err => {
    console.log("Error during audio playback:", err);
  });
      } else console.log(`Audio is null`);

      // Envoyer le message vocal au serveur
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          const base64data = reader.result.split(',')[1]; // Extraire le base64
          sendVocalMsg(base64data);
        }
      };
      reader.readAsDataURL(audioBlob);
    };
    // Commence l'enregistrement
    mediaRecorder.start();
  }

  function stopRecord() {
    console.log(`stopRecord audioChunks:`, audioChunks);
    mediaRecorder?.stop();
    // const audioElement = document.createElement('audio');
    // audioElement.controls = true; // Pour montrer les contrôles audio
    // audioElement.src = audioUrl;
    // document.body.appendChild(audioElement);
  }

</script>

<div class="w-full">
  <!-- msg tx/rx -->
  <Msg bind:chat/>
  <!-- Btn retour -->
  <div class="w-screen bg-white z-10">
    <button on:click={()=> matchOrChat = $app.footer = true}
      class="h-6 w-6 fixed left-4 bottom-16 mb-3">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="1px" x="0px" y="0px" viewBox="0 0 122.883 122.882" enable-background="new 0 0 122.883 122.882" xml:space="preserve"><g><path d="M61.441,0c16.967,0,32.327,6.877,43.446,17.996c11.119,11.119,17.996,26.479,17.996,43.445 c0,16.966-6.877,32.326-17.996,43.445c-11.119,11.118-26.479,17.995-43.446,17.995c-16.966,0-32.326-6.877-43.445-17.995 C6.877,93.768,0,78.407,0,61.441c0-16.967,6.877-32.327,17.996-43.445C29.115,6.877,44.475,0,61.441,0L61.441,0z M71.377,42.166 c1.736-1.784,1.695-4.637-0.088-6.372s-4.637-1.696-6.373,0.088L43.078,58.402l3.23,3.142l-3.244-3.146 c-1.737,1.792-1.693,4.652,0.099,6.39c0.052,0.05,0.104,0.099,0.158,0.146l21.595,22.082c1.736,1.784,4.59,1.823,6.373,0.088 c1.783-1.734,1.824-4.588,0.088-6.372L52.598,61.531L71.377,42.166L71.377,42.166z M98.496,24.386 C89.014,14.903,75.912,9.038,61.441,9.038s-27.572,5.865-37.055,15.348C14.903,33.869,9.038,46.97,9.038,61.441 c0,14.471,5.865,27.572,15.349,37.055c9.482,9.483,22.583,15.349,37.055,15.349s27.573-5.865,37.055-15.349 c9.484-9.482,15.35-22.584,15.35-37.055C113.846,46.97,107.98,33.869,98.496,24.386L98.496,24.386z"/></g></svg>
    </button>
  </div>
  <!-- Chat textBox -->
  <div class="w-full flex justify-center ml-5">
    <div class="fixed bg-white bottom-14 min-w-[80%] pl-3 mb-3 pr-1 py-1 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between">
      <div class="flex  w-full items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
          <g id="User Circle">
            <path id="icon" d="M6.05 17.6C6.05 15.3218 8.26619 13.475 11 13.475C13.7338 13.475 15.95 15.3218 15.95 17.6M13.475 8.525C13.475 9.89191 12.3669 11 11 11C9.6331 11 8.525 9.89191 8.525 8.525C8.525 7.1581 9.6331 6.05 11 6.05C12.3669 6.05 13.475 7.1581 13.475 8.525ZM19.25 11C19.25 15.5563 15.5563 19.25 11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11Z" stroke="#4F46E5" stroke-width="1.6" />
          </g>
        </svg>
        <input bind:value={msgContent} on:keyup={(e) => {if (e.key === 'Enter') sendMsg(msgContent)}} class="grow min-h-6 shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none" placeholder="Type here...">
      </div>
      <div class="flex items-center gap-2">
        <!-- Bouton trombone -->
        <button on:mousedown={record} on:mouseup={stopRecord} title="Press and hold to record">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" x="0px" y="0px" viewBox="0 0 83.44 122.88" style="enable-background:new 0 0 83.44 122.88" xml:space="preserve">
            <g id="Send audio">
              <path d="M45.04,95.45v24.11c0,1.83-1.49,3.32-3.32,3.32c-1.83,0-3.32-1.49-3.32-3.32V95.45c-10.16-0.81-19.32-5.3-26.14-12.12 C4.69,75.77,0,65.34,0,53.87c0-1.83,1.49-3.32,3.32-3.32s3.32,1.49,3.32,3.32c0,9.64,3.95,18.41,10.31,24.77 c6.36,6.36,15.13,10.31,24.77,10.31h0c9.64,0,18.41-3.95,24.77-10.31c6.36-6.36,10.31-15.13,10.31-24.77 c0-1.83,1.49-3.32,3.32-3.32s3.32,1.49,3.32,3.32c0,11.48-4.69,21.91-12.25,29.47C64.36,90.16,55.2,94.64,45.04,95.45L45.04,95.45z M41.94,0c6.38,0,12.18,2.61,16.38,6.81c4.2,4.2,6.81,10,6.81,16.38v30c0,6.38-2.61,12.18-6.81,16.38c-4.2,4.2-10,6.81-16.38,6.81 s-12.18-2.61-16.38-6.81c-4.2-4.2-6.81-10-6.81-16.38v-30c0-6.38,2.61-12.18,6.81-16.38C29.76,2.61,35.56,0,41.94,0L41.94,0z M53.62,11.51c-3-3-7.14-4.86-11.68-4.86c-4.55,0-8.68,1.86-11.68,4.86c-3,3-4.86,7.14-4.86,11.68v30c0,4.55,1.86,8.68,4.86,11.68 c3,3,7.14,4.86,11.68,4.86c4.55,0,8.68-1.86,11.68-4.86c3-3,4.86-7.14,4.86-11.68v-30C58.49,18.64,56.62,14.51,53.62,11.51 L53.62,11.51z" stroke="black" stroke-opacity="0.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </button>
        <!-- Bouton send -->
        <button class="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow " on:click={()=> {sendMsg(msgContent)}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g id="Send 01">
              <path id="icon" d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z" stroke="white" stroke-width="1.6" stroke-linecap="round" />
            </g>
          </svg>
          <h3 class="text-white text-xs font-semibold leading-4 px-2">Send</h3>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- <audio bind:this={audio}></audio> -->
<button on:click={()=>{if (audio){ audio.play(); console.log(`Lecture`, );}
  else
    console.log(`Lecture failed audio null`)}}>Play</button>
<RtCcall/>