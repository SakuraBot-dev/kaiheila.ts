interface CardMessage {
  type: 'card',
  theme: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary',
  color: string,
  size: 'xs' | 'sm' | 'md' | 'lg',
  modules : {
    type: string,
    text?: any,
    [index: string]: any
  }[]
}

export default class CardBuilder {
  public card: CardMessage

  constructor () {
    this.card = {
      type: 'card',
      theme: 'primary',
      color: '#66d',
      size: 'lg',
      modules: []
    }
  }

  setColor (color: string) {
    this.card.color = color
    
    return this
  }

  setTheme (theme: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary') {
    this.card.theme = theme
    
    return this
  }

  setSize (size: 'xs' | 'sm' | 'md' | 'lg') {
    this.card.size = size
    
    return this
  }

  addText (text: string) {
    this.card.modules.push({
      type: 'section',
      text: {
        type: 'plain-text',
        content: text
      }
    })
    
    return this
  }

  addSeparator() {
    this.card.modules.push({ type: 'divider' });
    return this;
  }

  addKMarkdown (kmarkdown: string) {
    this.card.modules.push({
      type: 'section',
      text: {
        type: 'kmarkdown',
        content: kmarkdown
      }
    })
    
    return this
  }

  addRowFields (cols: number, fields: { name: string, value: string }[]) {
    this.card.modules.push({
      type: 'section',
      text: {
        type: 'paragraph',
        cols: cols > fields.length ? fields.length : cols,
        fields: fields.map(item => {
          return {
            type: 'kmarkdown',
            content: `**${item.name}**\n${item.value}`
          }
        })
      }
    })
    
    return this
  }

  addImageAndText (options: {
    text: string,
    mode: 'left' | 'right',
    image: string,
    size: 'lg' | 'sm',
    circle: boolean
  }) {
    this.card.modules.push({
      type: 'section',
      text: {
        type: 'plain-text',
        content: options.text
      },
      mode: options.mode,
      accessory: {
        type: 'image',
        src: options.image,
        size: options.size,
        circle: options.circle
      }
    })
    
    return this
  }

  addButtonAndText (options: {
    text: string,
    mode: 'left' | 'right',
    theme: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary',
    button: {
      text: string,
      click?: 'return-val' | 'link',
      value: string
    }
  }) {
    this.card.modules.push({
      type: 'section',
      text: {
        type: 'plain-text',
        content: options.text
      },
      mode: options.mode,
      accessory: {
        type: 'button',
        theme: options.theme,
        click: options.button.click || '',
        value: options.button.value,
        text: {
          type: 'plain-text',
          content: options.button.text
        }
      }
    })
    
    return this
  }

  addImages (images: string[]) {
    this.card.modules.push({
      type: 'image-group',
      elements: images.map(url => {
        return {
          type: 'image',
          src: url
        }
      })
    })
    
    return this
  }

  addTitle (title: string) {
    this.card.modules.push({
      type: 'header',
      text: {
        type: 'plain-text',
        content: title
      }
    })
    
    return this
  }

  addButtons (buttons: {
    title: string,
    theme: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary',
    value: string,
    titleType?: string
    click?: 'return-val' | 'link',
  }[]) {
    this.card.modules.push({
      type: 'action-group',
      elements: buttons.map(btn => {
        return {
          type: 'button',
          theme: btn.theme,
          value: btn.value,
          click: btn.click || '',
          text: {
            type: btn.titleType || 'plain-text',
            content: btn.title
          }
        }
      })
    })

    return this
  }

  addFile (title: string, url: string, size: number) {
    this.card.modules.push({
      type: 'file',
      title: title,
      src: url,
      size: size
    })

    return this
  }
  
  addAudio (title: string, url: string, cover: string) {
    this.card.modules.push({
      type: 'audio',
      title: title,
      src: url,
      cover: cover
    })

    return this
  }
  
  addVideo (title: string, url: string) {
    this.card.modules.push({
      type: 'video',
      title: title,
      src: url
    })

    return this
  }

  addCountdown (options: {
    mode: 'day' | 'hour' | 'second',
    startTime?: number,
    endTime: number
  }) {
    this.card.modules.push({
      type: 'countdown',
      mode: options.mode,
      startTime: options.startTime || new Date().getTime(),
      endTime: options.endTime
    })
  }
}