<script lang="ts">
	import { us } from "@/store/userStore";
  import { login } from "@/service/user";
function accept() {
  if (!confirm("Vous devez valider votre email puis\nAccepter les CGV pour continuer..."))
    window.history.back()
}

async function isEmailVerified() {
  // recup le user et voir si son mail est verifié
  // pour le faire passer ou non à l'étape d'apres
  const resp = await login({userName: $us.user.userName, password: $us.user.password});
  if (resp?.data.emailVerified)
    $us.user.emailVerified = resp?.data.emailVerified; // ceci renverra alors vers l'autre
  else
    alert(("Vous devez valider votre email puis\nAccepter les CGV pour continuer..."))
}

</script>

<header class="bg-white shadow-md py-4">
    <div class="container mx-auto flex justify-between items-center px-4">
      <h1 class="text-2xl font-bold text-gray-800">MatchaFrida</h1>
      <nav>
        <button on:click={accept} class="text-blue-500 font-semibold px-3">Connexion</button>
        <button on:click={accept} class="text-blue-500 font-semibold px-3">Inscription</button>
      </nav>
    </div>
  </header>

  <!-- Sermon -->
  <section>
    <div class="container mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold mb-6 text-center">Sermon sur le Consentement et les Valeurs Woke</h1>
      
      <div class="mb-6">
          <p class="text-xl mb-4">Chers utilisateurs et utilisatrices,</p>
          <p class="text-lg mb-4">Bienvenue à tous sur notre application de Matcha, un espace dédié aux Matcha de nouvelles personnes et à la construction de relations significatives. Aujourd'hui, j'aimerais aborder un sujet fondamental, essentiel pour notre communauté : le consentement, ainsi que les valeurs que l'on appelle souvent "woke".</p>
      </div>
      
      <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Le Consentement : Une Base Indispensable</h2>
          <p class="text-lg mb-4">Le consentement est la pierre angulaire de toute interaction respectueuse et saine. Dans le contexte des Matchas, cela signifie que chaque personne doit se sentir libre et à l'aise de dire oui ou non à toute proposition, qu'elle soit verbale, écrite ou physique. Le consentement doit être :</p>
          <ul class="list-disc list-inside mb-4 text-lg">
              <li class="mb-2"><strong>Éclairé</strong> : Chaque individu doit avoir toutes les informations nécessaires pour prendre une décision en toute connaissance de cause.</li>
              <li class="mb-2"><strong>Volontaire</strong> : Le consentement doit être donné librement, sans pression, coercition ou manipulation.</li>
              <li class="mb-2"><strong>Révocable</strong> : Chacun a le droit de retirer son consentement à tout moment, et cela doit être respecté sans question.</li>
              <li class="mb-2"><strong>Précis</strong> : Dire oui à une chose ne signifie pas dire oui à tout. Chaque action nécessite son propre consentement.</li>
          </ul>
          <p class="text-lg mb-4">En respectant ces principes, nous créons un environnement où chacun se sent en sécurité et respecté. C'est non seulement une question de respect mutuel, mais aussi de responsabilité personnelle.</p>
      </div>

      <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Les Valeurs Woke : Égalité et Inclusion</h2>
          <p class="text-lg mb-4">Le terme "woke" peut parfois être mal compris ou controversé, mais il représente des valeurs importantes de notre société moderne : l'égalité, l'inclusion, et la justice sociale. Dans le cadre de notre application de Matcha, voici comment nous incarnons ces valeurs :</p>
          <ul class="list-disc list-inside mb-4 text-lg">
              <li class="mb-2"><strong>Égalité</strong> : Chaque personne doit être traitée avec le même respect et la même dignité, indépendamment de son genre, de son orientation sexuelle, de sa race, de sa religion, de son âge ou de toute autre caractéristique personnelle.</li>
              <li class="mb-2"><strong>Inclusion</strong> : Notre communauté se doit d'être un espace accueillant pour tous. Cela signifie que nous devons être conscients de nos préjugés, travailler activement à les surmonter et créer des opportunités pour que chacun se sente inclus et valorisé.</li>
              <li class="mb-2"><strong>Respect des identités</strong> : Chacun a le droit de définir et d'exprimer son identité. Utiliser les pronoms préférés des autres, respecter leurs choix de présentation et être ouvert à apprendre des expériences différentes des nôtres sont des comportements fondamentaux.</li>
              <li class="mb-2"><strong>Lutte contre les discriminations</strong> : Nous devons nous opposer à toutes formes de discriminations et de harcèlement. Cela inclut la prise de position contre les comportements sexistes, racistes, homophobes, transphobes ou tout autre type de comportement discriminatoire.</li>
          </ul>
      </div>

      <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Conclusion</h2>
          <p class="text-lg mb-4">Ensemble, en respectant le consentement et en adoptant des valeurs woke, nous pouvons créer une communauté de Matcha où chacun se sent valorisé, respecté et en sécurité. Ces principes ne sont pas des options, mais des engagements que nous devons tous prendre pour garantir une expérience positive et enrichissante pour tous les membres de notre communauté.</p>
          <p class="text-lg mb-4">Merci de votre attention et de votre engagement à faire de cette application de Matcha un espace où règnent le respect, l'inclusion et la bienveillance.</p>
          <p class="text-lg">Ensemble, bâtissons un avenir meilleur, un Matcha à la fois.</p>
      </div>

      <div class="text-right">
          <p class="text-lg font-semibold">Avec respect et solidarité,</p>
          <p class="text-lg"><em>L'équipe de l'application Matcha</em></p>
      </div>
    </div>
  </section>

  <!-- Section Hero -->
  <section class="bg-blue-500 text-white text-center py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-4">Rencontrez des gens, faites de nouvelles connexions</h2>
      <p class="mb-6">Rejoignez notre communauté et commencez à rencontrer de nouvelles personnes dès aujourd'hui!</p>
      <button on:click={isEmailVerified} class="bg-white text-blue-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-200">Accepter les valeurs Matcha & Commencez maintenant</button>
    </div>
  </section>

  <!-- Fonctionnalités -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h3 class="text-2xl font-bold text-gray-800 text-center mb-8">Pourquoi choisir MatchaFrida ?</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-xl font-bold mb-2">Sécurité</h4>
          <p>Nous nous engageons à protéger votre sécurité et vos données personnelles.</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-xl font-bold mb-2">Matchs basés sur les intérêts</h4>
          <p>Trouvez des personnes qui partagent vos centres d'intérêt grâce à notre algorithme avancé.</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-xl font-bold mb-2">Communauté active</h4>
          <p>Rejoignez une communauté dynamique et engageante avec des événements réguliers.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Témoignages -->
  <section class="bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <h3 class="text-2xl font-bold text-gray-800 text-center mb-8">Témoignages</h3>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide bg-white rounded-lg shadow-md p-6">
            <p>"MatchaFrida m'a aidé à trouver l'amour de ma vie. Merci !"</p>
            <p class="mt-4 text-right font-semibold">- Marie, 28 ans</p>
          </div>
          <div class="swiper-slide bg-white rounded-lg shadow-md p-6">
            <p>"Une application facile à utiliser et remplie de gens sympas !"</p>
            <p class="mt-4 text-right font-semibold">- Julien, 34 ans</p>
          </div>
          <!-- Ajouter plus de témoignages ici -->
        </div>
      </div>
    </div>
  </section>


  <!-- Pied de page -->
  <footer class="bg-white shadow-md py-4">
    <div class="container mx-auto px-4 text-center text-gray-600">
      <p>&copy; 2024 MatchaFrida. Tous droits réservés.</p>
      <nav>
        <a href="#" class="text-blue-500 font-semibold px-3">À propos</a>
        <a href="#" class="text-blue-500 font-semibold px-3">Conditions</a>
        <a href="#" class="text-blue-500 font-semibold px-3">Politique de confidentialité</a>
      </nav>
    </div>
  </footer>