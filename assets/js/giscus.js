const giscusConfig = {
  repo: "D4ttara/metacademy-of-humanity",
  repoId: "R_kgDOT2k0ZA",
  category: "Announcements",
  categoryId: "DIC_kwDOT2k0ZM4DDQAx"
};

const language = document.documentElement.lang.startsWith("ru") ? "ru" : document.documentElement.lang.startsWith("uk") ? "uk" : "en";

document.querySelectorAll("[data-giscus]").forEach(host => {
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.repo = giscusConfig.repo;
  script.dataset.repoId = giscusConfig.repoId;
  script.dataset.category = giscusConfig.category;
  script.dataset.categoryId = giscusConfig.categoryId;
  script.dataset.mapping = "pathname";
  script.dataset.strict = "0";
  script.dataset.reactionsEnabled = "1";
  script.dataset.emitMetadata = "0";
  script.dataset.inputPosition = "bottom";
  script.dataset.theme = "preferred_color_scheme";
  script.dataset.lang = language;
  script.dataset.loading = "lazy";
  host.append(script);
});
