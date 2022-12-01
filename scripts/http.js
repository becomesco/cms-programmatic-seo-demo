const http = require('http');
const https = require('https');

/**
 * @typedef {{
 *   host?: {
 *     name: string;
 *     port?: string;
 *   };
 *   path: string;
 *   method: 'POST';
 *   headers?: { [key: string]: string };
 *   data?: unknown;
 * }} HttpConfig
 * @typedef {{
 *   status: number;
 *   data: any;
 *   headers: http.IncomingHttpHeaders;
 * }} HttpResponse
 * @typedef {{
 *   status: number;
 *   headers: http.IncomingHttpHeaders;
 *   data: unknown;
 *   err: Error | http.IncomingMessage;
 * }} HttpResponseError
 */

module.exports.Http = class Http {
  /**
   * @param {string?} host
   * @param {string?} port
   * @param {string?} basePath
   */
  constructor(host, port, basePath) {
    this.host = host;
    this.port = port;
    this.basePath = basePath;
  }

  /**
   * @param {{
   *   name?: string;
   *   port?: string;
   * }} host
   */
  setHost(host) {
    this.host = host.name;
    this.port = host.port;
  }

  /**
   * @param {string?} basePath
   */
  setBasePath(basePath) {
    this.basePath = basePath;
  }

  /**
   * @param {HttpConfig} config
   * @returns {Promise<HttpResponse>}
   */
  async send(config) {
    return new Promise((resolve, reject) => {
      /**
       * @type {http.RequestOptions}
       */
      const requestConfig = {
        host: config.host ? config.host.name : this.host,
        port: config.host && config.host.port ? config.host.port : this.port,
        path: this.basePath ? `${this.basePath}${config.path}` : config.path,
        method: config.method,
        headers: config.headers ? config.headers : {},
      };
      /**
       * @type {string}
       */
      let data;
      if (typeof config.data === 'object') {
        data = JSON.stringify(config.data);
        requestConfig.headers['content-type'] = 'application/json';
      } else if (typeof config.data !== 'undefined') {
        data = `${config.data}`;
        requestConfig.headers['content-type'] = 'text/plain';
      }
      const sender =
        config.host && config.host.port
          ? config.host.port === '443'
            ? https
            : http
          : this.port === '443'
            ? https
            : http;
      const request = sender.request(requestConfig, (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('error', (err) => {
          /**
           * @type {HttpResponseError}
           */
          const output = {
            status: res.statusCode,
            err,
            headers: res.headers,
            data:
              res.headers['content-type'] === 'application/json'
                ? JSON.parse(rawData)
                : rawData,
          };
          reject(output);
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            /**
             * @type {HttpResponseError}
             */
            const output = {
              status: res.statusCode,
              err: res,
              headers: res.headers,
              data:
                res.headers['content-type'] === 'application/json'
                  ? JSON.parse(rawData)
                  : rawData,
            };
            reject(output);
            return;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: res.headers['content-type'].includes('application/json')
              ? JSON.parse(rawData)
              : rawData,
          });
        });
      });
      request.on('error', (e) => {
        reject(e);
      });
      if (typeof data !== 'undefined') {
        request.write(data);
      }
      request.end();
    });
  }
};
