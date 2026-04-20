import { c as createAstro, d as createComponent } from '../chunks/astro/server_D2PXleiN.mjs';
import 'piccolore';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://cms.boostideal.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return Astro2.redirect("/keystatic");
}, "/Volumes/Extreme SSD/BoostIdeal/website/boostideal-website/cms/src/pages/index.astro", void 0);

const $$file = "/Volumes/Extreme SSD/BoostIdeal/website/boostideal-website/cms/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
