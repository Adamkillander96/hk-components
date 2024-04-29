import { Component, Host, Element, Prop, Watch, h } from '@stencil/core';

import { translations, data, browserLanguage, createButtonId, createTabId, StyckDetaljTitle, StyckDetaljer } from '../../index';

import { svg } from '../../svg/styckdetaljer';

@Component({
  tag: 'hk-styckdetalj',
  styleUrl: 'hk-styckdetalj.scss',
})
export class HkStyckdetalj {
  list: HTMLUListElement;
  graphic: HTMLElement;
  detailPaths: SVGPathElement[];

  @Element() hostElement: HTMLElement;

  /** Set the language. Swedish (sv) or English (en). */
  @Prop({ mutable: true, reflect: true }) language: 'sv' | 'en' = null;
  /**
   * Set a max-width if the component is not inside a max-width container.
   * Any valid CSS string value is accepted.
   */
  @Prop() maxWidth: string = null;
  @Watch('maxWidth')
  watchMaxWidth() {
    if (!this.maxWidth) return;
    this.hostElement.style.setProperty('--hk-max-width', this.maxWidth);
  }

  /** Set a preselected detail. */
  @Prop({ mutable: true }) selected?: StyckDetaljTitle = 'HOGREV';
  @Watch('selected')
  watchSelected() {
    this.setActiveSvgPath();

    const button = this.hostElement.querySelector<HTMLButtonElement>(`#${createButtonId(this.selected)}`);

    this.setActiveTile(button);
  }

  componentWillLoad() {
    this.watchMaxWidth();

    if (this.language) return;
    this.language = browserLanguage();
  }

  componentDidLoad() {
    this.list = this.hostElement.querySelector<HTMLUListElement>('.hk-styckdetalj-list');
    this.graphic = this.hostElement.querySelector<HTMLElement>('#hk-graphic');
    this.detailPaths = Array.from(this.graphic.querySelectorAll<SVGPathElement>('.hk-styckdetalj-bg'));

    const texts = Array.from(this.graphic.querySelectorAll<SVGTextElement>('.hk-styckdetalj-text'));
    texts.forEach(text => {
      text.addEventListener('mouseenter', (e: MouseEvent) => this.handleSvgMouse(e));
      text.addEventListener('mouseleave', (e: MouseEvent) => this.handleSvgMouse(e));
    });

    this.watchSelected();
  }

  findDetail(title: StyckDetaljTitle): StyckDetaljer {
    return data.find(item => title === item.title);
  }

  selectTab(title: StyckDetaljTitle) {
    if (this.selected === title) return;
    this.selected = title;
  }

  getRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  }

  setActiveTile(button: HTMLButtonElement) {
    const { width, left, height } = this.getRect(button);
    const navCors = this.getRect(this.list);

    const offset = left + this.list.scrollLeft - navCors.left;

    this.list.style.setProperty('--hk-active-width', `${width}px`);
    this.list.style.setProperty('--hk-active-offset', `${offset}px`);

    if (!this.list.style.getPropertyValue('--hk-active-height')) {
      this.list.style.setProperty('--hk-active-height', `${height}px`);
    }

    button.focus();
  }

  setActiveSvgPath() {
    this.detailPaths.forEach(item => item.removeAttribute('data-active'));

    const { number } = this.findDetail(this.selected);
    const svg = this.detailPaths.find(({ id }) => id === `kossa_bg_${number}`);
    svg?.setAttribute('data-active', 'true');
  }

  translate(prop: string): string {
    return translations?.[prop]?.[this.language || 'en'] || prop;
  }

  handleSvgClick(event: PointerEvent) {
    const target = event.target as HTMLElement;
    const name = target.localName;

    if (!name.match(/^(path|text|tspan)$/)) return;

    const text = !!target.id ? target : target.parentElement;

    const number = Number(text.id.replace(/[^0-9.]/g, ''));
    if (!number) return;
    const { title } = data.find(item => item.number === number);

    this.selectTab(title);
  }

  handleSvgMouse(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const text = !!target.id ? target : target.parentElement;
    const number = Number(text.id.replace(/[^0-9.]/g, ''));
    const element = this.hostElement.querySelector(`#kossa_bg_${number}`);

    if (!element) return;

    element.toggleAttribute('data-hover');
  }

  keyTab(event: KeyboardEvent, number: number) {
    const { key } = event;

    const goBackRgx = 'ArrowLeft|PageUp|ArrowUp';
    const goForwardRgx = 'ArrowRight|PageDown|ArrowDown';

    if (!key.match(`^(${goBackRgx}|${goForwardRgx}|Home|End)$`)) return;

    event.preventDefault();

    const items = this.detailPaths.length;

    const canGoBack = number > 1;
    const canGoForward = items > number;

    const goBack = !!key.match(`^(${goBackRgx})$`);
    const goForward = !!key.match(`^(${goForwardRgx})$`);

    const goFirst = key === 'Home';
    const goLast = key === 'End';

    let newNumber = number;

    if (goBack && canGoBack) newNumber--;
    if (goForward && canGoForward) newNumber++;
    if (goFirst || (goBack && !canGoBack)) newNumber = items;
    if (goLast || (goForward && !canGoForward)) newNumber = 1;

    const { title } = data.find(item => item.number === newNumber);

    this.selectTab(title);
  }

  isActive(title: StyckDetaljTitle): boolean {
    return this.selected === title;
  }

  figCaption(): string {
    const caption = document.createElement('figcaption');
    caption.className = 'hk-styckdetalj-graphic-caption hk-styckdetalj-sr';
    caption.id = 'hk-styckdetalj-svg';
    caption.innerText = this.translate('ILLUSTRATION');

    return caption.outerHTML;
  }

  createHeader() {
    return (
      <header class="hk-styckdetalj-header">
        <h2>{this.translate('TITLE')}</h2>
        <p>{this.translate('DESCRIPTION')}</p>
      </header>
    );
  }

  createNav() {
    return (
      <nav class="hk-styckdetalj-nav" role="tablist" aria-label={this.translate('NAVIGATION')}>
        <ul class="hk-styckdetalj-list">
          {data.map(({ number, title }) => this.createButton(number, title))}
          <li class="hk-styckdetalj-tile" aria-hidden="true"></li>
        </ul>
      </nav>
    );
  }

  createButton(number: number, title: StyckDetaljTitle) {
    return (
      <li class="hk-styckdetalj-item">
        <button
          id={createButtonId(title)}
          class="hk-styckdetalj-button"
          role="tab"
          tabindex={this.isActive(title) ? '0' : '-1'}
          aria-selected={this.isActive(title).toString()}
          aria-controls={createTabId(title)}
          onClick={() => this.selectTab(title)}
          onKeyDown={e => this.keyTab(e, number)}
        >
          <span>
            {number}. {this.translate(title)}
          </span>
        </button>
      </li>
    );
  }

  render() {
    return (
      <Host>
        <article class="hk-styckdetalj">
          {this.createHeader()}

          <figure id="hk-graphic" class="hk-styckdetalj-graphic" innerHTML={svg + this.figCaption()} onClick={(e: PointerEvent) => this.handleSvgClick(e)} />

          {this.createNav()}

          <section class="hk-styckdetalj-content">
            {data.map(({ number, title }) => (
              <div class="hk-styckdetalj-content-info" id={createTabId(title)} role="tabpanel" tabindex="0" aria-labelledby={createButtonId(title)} hidden={!this.isActive(title)}>
                <h3>
                  {number}. {this.translate(title)}
                </h3>
                {this.translate(`${title}_DESC`)
                  .split('|')
                  .map(txt => (
                    <p>{txt}</p>
                  ))}
              </div>
            ))}
          </section>
        </article>
      </Host>
    );
  }
}
