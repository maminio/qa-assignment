import { observable, action } from 'mobx';

export default class docsStore {
  @observable docs = [];
  @observable filters = { status: '', search: '' };

  constructor(docsService) {
    this.docsService = docsService;
  }

  updateFilters({ status, search }) {
    this.filters.status = status;
    this.filters.search = search;
    this.fetchDocs();
  }

  @action
  resetDocs() {
    this.docs = [];
  }

  @action
  async fetchDocs() {
    const result = await this.docsService.fetchDocs(this.filters);

    if (result) {
      this.docs = result.data;
    }
  }

  @action
  async createDoc(formData) {
    const result = await this.docsService.createDoc(formData);

    if (result) {
      this.docs.push(result.data);
    }
  }

  @action
  async deleteDoc(id) {
    const idx = this.docs.findIndex(doc => doc.id === id);
    await this.docsService.deleteDoc(id);
    this.docs.splice(idx, 1);
  }



  @action
  async deleteAllDocs() {
    await this.docsService.deleteAllDocs();
    this.docs = [];
  }

  @action
  async updateDocStatus(id, status) {
    const doc = this.docs.find(doc => doc.id === id);
    await this.docsService.updateDocStatus(id, status);
    doc.status = status;
  }
}
