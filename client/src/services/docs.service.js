import BaseHttpService from './base-http.service';
import queryString from 'query-string';

export default class DocsService extends BaseHttpService {
  fetchDocs({ status, search}) {
    const queryObj = {};

    if (status.length) {
      queryObj.status = status;
    }

    if (search.length) {
      queryObj.search = search;
    }

    const queryStr = queryString.stringify(queryObj);
    return this.get('docs' + (queryStr ? `?${queryStr}` : ''));
  }

  async deleteDoc(id) {
    await this.delete(`docs/${id}`);
  }

  async deleteAllDocs(id) {
    await this.delete(`docs/all`);
  }

  updateDocStatus(id, status) {
    return this.patch(`docs/${id}/status`, { status });
  }

  createDoc(formData) {
    return this.post(`docs/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}
