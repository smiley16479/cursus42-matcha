<script lang="ts">
  import { onMount } from 'svelte';
  import soc from '@/store/socketStore';

  let localStream: MediaStream | null = null;
  let remoteStream = null;
  let peerConnection: RTCPeerConnection | null = null;

  const servers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' } // Serveur STUN public
    ]
  };

  onMount(() => {
    // Écouter les messages de signalisation
    $soc.socket?.on('signal', async (data) => {
      if (!peerConnection) return;

      if (data.type === 'offer') {
        // Recevoir une offre
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        $soc.socket?.emit('signal', { type: 'answer', answer });
      } else if (data.type === 'answer') {
        // Recevoir une réponse
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === 'candidate') {
        // Recevoir un ICE Candidate
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  });

  async function startCall() {
    // Initialisation du peer connection
    peerConnection = new RTCPeerConnection(servers);

    // Capturer l'audio local
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!(peerConnection && localStream))
      console.log("(!(peerConnection && localStream))")
    localStream.getTracks().forEach(track => {if (peerConnection && localStream) peerConnection.addTrack(track, localStream)});

    // Recevoir le flux audio distant
    peerConnection.ontrack = event => {
      if (event.streams && event.streams[0]) {
        remoteStream = event.streams[0];
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
      }
    };

    // Gérer les ICE candidates
    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate && $soc.socket) {
        $soc.socket.emit('signal', { type: 'candidate', candidate });
      }
    };

    // Créer une offre
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    $soc.socket?.emit('signal', { type: 'offer', offer });
  }
</script>

<button on:click={startCall}>Commencer l'appel</button>