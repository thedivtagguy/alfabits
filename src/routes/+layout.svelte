<script>
	import '../app.css';
</script>

<div class="flex flex-col justify-center w-full max-w-sm mx-auto app">
	<header class="py-6 text-black border-t-8 border-black rounded-tl-2xl rounded-tr-2xl">
		<h1 class="font-sans text-4xl font-extrabold uppercase">Sequence</h1>
	</header>
	<main
		class="h-full min-h-[85vh] mt-2 border border-t-0 rounded-tl-0 rounded-br-xl rounded-bl-xl rounded-tr-0 border-black/20"
	>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
