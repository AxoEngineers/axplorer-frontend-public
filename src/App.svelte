<script>
    import router from 'page';
    import Index from './Pages/Index.svelte';
    import Data from './Pages/Data.svelte';
    //import WheelPage from './Pages/WheelPage.svelte';
    import AboutPage from './Pages/AboutPage.svelte';
    import BridgePage from './Pages/BridgePage.svelte';
    import StakePage from './Pages/StakePage.svelte';
    import ApiPage from './Pages/ApiPage.svelte';
    import Lookup from './Pages/Lookup.svelte';
    import View from './Pages/View.svelte';
    import Nav from "./Components/Nav.svelte";
    import NavItem from "./Components/NavItem.svelte";
	//import AxoweenPage from './Pages/AxoweenPage.svelte';

    let page;
    let params = {};
    router('/', () => page = Index);
    router('/data', () => page = Data);
    router('/api', () => page = ApiPage);
    router('/stake', () => page = StakePage);
    router('/about', () => page = AboutPage);
    router('/bridge', () => page = BridgePage);
	// router('/yuletide-axos', () => page = AxoweenPage);
    //router('/wheel', () => page = WheelPage);
    router('/lookup/:wallet?', (ctx, next) => {
        params = ctx.params;
        next();
	}, () => page = Lookup);
    router('/view/:id', (ctx, next) => {
        params = ctx.params;
        next();
    }, () => page = View);
    router.start();
</script>
<main>
	<Nav>
		<slot slot="icon"><span style="font-family: 'Montserrat'; font-weight: 700; color: white !important;">AXPLORER</span></slot>
		<slot slot="items">
		  	<!-- <NavItem href="/yuletide-axos">
				<span class="icon-text">
					<span class="icon"><i class="fa fa-tree"></i></span>
					<span>Yuletide Axos</span>
				</span>
			</NavItem> -->
			<NavItem href="/">
				<span class="icon-text">
					<span class="icon"><i class="fas fa-atlas"></i></span>
					<span>Explore</span>
				</span>
			</NavItem>
			<NavItem href="/bridge">
				<span class="icon-text">
					<span class="icon"><i class="fas fa-exchange-alt"></i></span>
					<span>Bridge</span>
				</span>
			</NavItem>
			<NavItem href="/stake">
				<span class="icon-text">
					<span class="icon"><i class="fas fa-chart-line"></i></span>
					<span>Stake</span>
				</span>
			</NavItem>
			<NavItem href="/lookup">
				<span class="icon-text">
					<span class="icon"><i class="fa fa-search"></i></span>
					<span>Lookup</span>
				</span>
			</NavItem>
			<NavItem href="/about">
				<span class="icon-text">
					<span class="icon"><i class="fas fa-info"></i></span>
					<span>About</span>
				</span>
			</NavItem>
			<NavItem href="/api">
				<span class="icon-text">
					<span class="icon"><i class="fas fa-code"></i></span>
					<span>API</span>
				</span>
			</NavItem>
		</slot>
	</Nav>
	<svelte:component this={page} params={params} />
</main>


<style lang="scss">
</style>