// Keeps the browser's install offer so setup can show an Install button (not shown to kids).

interface InstallOffer extends Event {
  prompt(): Promise<void>;
}

let offer = $state<InstallOffer | null>(null);
const standalone = matchMedia('(display-mode: standalone)').matches;

addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  offer = e as InstallOffer;
});
addEventListener('appinstalled', () => (offer = null));

export const install = {
  /** The browser offered installation and it was not used yet. */
  get ready(): boolean { return !!offer; },
  /** Already running as an installed app. */
  standalone,
  /** Shows the browser's install dialog once. */
  async run(): Promise<void> {
    const o = offer;
    offer = null;
    await o?.prompt();
  },
};
