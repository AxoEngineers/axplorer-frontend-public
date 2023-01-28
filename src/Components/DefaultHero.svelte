<script>

</script>

<section class="hero is-medium">
	<div class="hero-background"></div>
	<div class="hero-body">
		<div class="container">
			<h1 class="title">Axplorer | Axolittles Explorer</h1>
			<p class="subtitle">Axplorer is your entry to the Axolittles ecosystem and all its utility.</p>
		</div>
	</div>
</section>

<style lang="scss">
  .hero {
    position: relative;
    overflow: hidden;
    &:before {
      content: '';
      position: absolute;
      width: 200%;
      height: 400%;
      top: -150%;
      left: -50%;
      z-index: 0;
      background-image: url('/media/backdrop.png');
      background-repeat: repeat;
      transform: rotate(30deg);
      opacity: 0.5;
    }

    .hero-body {
      z-index: 1;

      .columns {
        margin-top: 2.5rem;
      }
    }

    .hero-foot {
      a {
        color: white;

        .title {
          margin-bottom: 0.25rem;
        }

        &:hover, &:visited {
          color: white;
          text-decoration: none;
        }
      }

      margin-bottom: 2rem;
    }
  }
</style>