const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...document.querySelectorAll(".deck-nav__link")];
const players = [...document.querySelectorAll("[data-video-player]")];
const currentSectionNode = document.querySelector("[data-current-section]");
const totalSectionsNode = document.querySelector("[data-total-sections]");

const formatCount = (value) => String(value).padStart(2, "0");

const setActiveNav = (id) => {
  const index = sections.findIndex((section) => section.id === id);

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (currentSectionNode && index >= 0) {
    currentSectionNode.textContent = formatCount(index + 1);
  }
};

if (totalSectionsNode) {
  totalSectionsNode.textContent = formatCount(sections.length);
}

players.forEach((player) => {
  player.addEventListener("click", () => {
    const frame = player.closest(".video-frame");

    if (!frame) {
      return;
    }

    frame.classList.add("is-revealed");
  });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        setActiveNav(entry.target.id);
      });
    },
    {
      rootMargin: "-32% 0px -48% 0px",
      threshold: 0.01,
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
} else {
  sections.forEach((section) => {
    section.classList.add("is-visible");
  });
}

window.addEventListener("hashchange", () => {
  const target = window.location.hash
    ? document.querySelector(window.location.hash)
    : null;

  if (target) {
    setActiveNav(target.id);
  }
});

const initialTarget = window.location.hash
  ? document.querySelector(window.location.hash)
  : sections[0];

if (initialTarget) {
  initialTarget.classList.add("is-visible");
  setActiveNav(initialTarget.id);
}
