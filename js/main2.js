/* 0) DEBUG opcional */
const DEBUG = false;

/* 1) CONFIG MÍNIMA PARA O ELEMENTOR */
window.elementorFrontendConfig = window.elementorFrontendConfig || {
  version: "3.28.0",
  environmentMode: {
    edit: false,
    wpPreview: false,
    isScriptDebug: false
  },
  urls: {
    assets: "wp-content/plugins/elementor/assets/",
    uploadUrl: "wp-content/uploads"
  },
  settings: { page: {} },
  kit: {},
  experimentalFeatures: {
    "nested-elements": false,
    container: false
  },
  responsive: {
    breakpoints: {
      mobile:       { value: 767,  direction: "max", is_enabled: true  },
      tablet:       { value: 1024, direction: "max", is_enabled: true  },
      mobile_extra: { value: 880,  direction: "max", is_enabled: false },
      tablet_extra: { value: 1200, direction: "max", is_enabled: false },
      laptop:       { value: 1366, direction: "max", is_enabled: false },
      widescreen:   { value: 2400, direction: "min", is_enabled: false }
    }
  }
};

/* (opcional) silencia avisos de “deprecation” */
window.elementorDevTools = window.elementorDevTools || {
  deprecation: { deprecated(){ /* noop */ } }
};

/* 2) CARREGADOR COM ORDEM CORRETA (sem logs de sucesso) */
function loadScript(src){
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // mantém ordem
    s.onload  = () => { if (DEBUG) console.log("ok:", src); resolve(); };
    s.onerror = () => { console.error("❌ Falhou ao carregar:", src); reject(new Error(src)); };
    document.head.appendChild(s);
  });
}
async function loadGroup(list){ for (const u of list) await loadScript(u); }

(async () => {
  try {
    // A) jQuery + UI
    await loadGroup([
      "wp-includes/js/jquery/jquery.min.js",
      "wp-includes/js/jquery/jquery-migrate.min.js",
      "wp-includes/js/jquery/ui/core.min.js"
    ]);
    window.$ = window.jQuery = window.jQuery || window.$;

    // B) MediaElement
    await loadGroup([
      "wp-includes/js/mediaelement/mediaelement-and-player.min.js",
      "wp-includes/js/mediaelement/mediaelement-migrate.min.js",
      "wp-includes/js/mediaelement/wp-mediaelement.min.js"
    ]);

    // C) libs WP comuns
    await loadGroup([
      "wp-includes/js/dist/vendor/react.min.js",
      "wp-includes/js/dist/vendor/react-dom.min.js",
      "wp-includes/js/dist/escape-html.min.js",
      "wp-includes/js/dist/element.min.js"
    ]);

    // D) Elementor core (ordem crítica       "wp-content/plugins/elementor/assets/js/webpack.runtime.min.js",)
    await loadGroup([
      "wp-content/plugins/elementor/assets/js/frontend-modules.min.js",
      "wp-content/plugins/elementor/assets/js/frontend.min.js"
    ]);

    // E) Tema Hello + Header/Footer Elementor
    await loadGroup([
      "wp-content/themes/hello-elementor/assets/js/hello-frontend.min.js",
      "wp-content/plugins/header-footer-elementor/inc/js/frontend.js"
    ]);

    // F) ElementsKit
    await loadGroup([
      "wp-content/plugins/elementskit-lite/widgets/init/assets/js/widget-scripts.js",
      "wp-content/plugins/elementskit-lite/widgets/init/assets/js/odometer.min.js",
      "wp-content/plugins/elementskit-lite/widgets/init/assets/js/animate-circle.min.js",
      "wp-content/plugins/elementskit-lite/widgets/init/assets/js/elementor.js"
    ]);

    // G) MetForm
    await loadGroup([
      "wp-content/plugins/metform/public/assets/js/htm.js"
    ]);
	
    if (DEBUG) console.log("Todos os scripts foram carregados na ordem correta.");
  } catch (err) {
    console.error("💥 Erro ao carregar:", err.message);
  }
})();
