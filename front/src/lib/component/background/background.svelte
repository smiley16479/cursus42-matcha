<script lang="ts">

const imgUrl = '/MatchaFrida.webp';
</script>

<div style="background-image: url({imgUrl});">
	<slot/>
</div>
<style>

div {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-image: url({{imgUrl}}); /* Ne marche pas  */
  background-size: cover; 
  overflow: hidden;  /* Empêche le défilement dû à l'image ( !! mais cache ce qui en est en dehors !! )*/
}

</style>