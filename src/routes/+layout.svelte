<script>
	import '../app.css';
</script>

<div class="app">
	<header class="bg-black py-2 text-white">
		<h1 class="font-semibold text-4xl">Alfabits</h1>
	</header>
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;

		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
