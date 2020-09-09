export class Util {
  static getMailtoUrl(to, subject, body) {
    const args = [];
    if (typeof subject !== 'undefined') {
      args.push('subject=' + encodeURIComponent(subject));
    }
    if (typeof body !== 'undefined') {
      args.push('body=' + encodeURIComponent(body));
    }

    let url = 'mailto:' + encodeURIComponent(to);
    if (args.length > 0) {
      url += '?' + args.join('&');
    }
    return url;
  }

  static async WebpIsSupported() {
    // If the browser doesn't has the method createImageBitmap, you can't display webp format
    if (!self.createImageBitmap) {
      return false;
    }

    // Base64 representation of a white point image
    const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

    // Retrieve the Image in Blob Format
    const blob = await fetch(webpData).then(r => r.blob());

    // If the createImageBitmap method succeeds, return true, otherwise false
    return createImageBitmap(blob).then(() => true, () => false);
  }

  // 开启价值观动效
  static enableSocialistValuesEffect() {
    let index = 0;
    $('body').on('click', function (e) {
      const a = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'];
      const span = $('<span/>').text(a[index]) as any;
      index = (index + 1) % a.length;
      const x = e.pageX;
      const y = e.pageY;
      span.css({
        'z-index': 999,
        'top': y - 20,
        'left': x,
        'position': 'absolute',
        'font-weight': 'bold',
        'color': '#d6c128'
      });
      $('body').append(span);
      span.animate({
          'top': y - 180,
          'opacity': 0
        },
        1500,
        function () {
          span.remove();
        });
    });
  }
}
