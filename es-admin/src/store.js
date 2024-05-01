import { toRaw, reactive } from 'vue';
import uuid from './uuid';

const createFinder = (id) => (project) => project.id === id;

export const changedProjects = reactive({
  data: [],
  add(projectId) {
    if (!this.data.includes(projectId)) {
      this.data.push(projectId);
    }
  },
  remove(projectId) {
    this.data = this.data.filter((item) => item !== projectId);
  },
  has(projectId) {
    return this.data.find((item) => item === projectId) !== undefined;
  },
});

export default {

  async getAll() {
    const data = await chrome.storage.sync.get();
    return data.projects ?? [];
  },

  async setAll(projects) {
    await chrome.storage.sync.set({ projects });
    this.onSave();
  },

  async get(id) {
    const projects = await this.getAll();
    return projects.find(createFinder(id));
  },

  async create() {
    const draft = {
      id: uuid(),
      name: 'New project',
      environments: [],
    };
    const projects = await this.getAll();
    projects.push(draft);
    await chrome.storage.sync.set({ projects });
    this.onSave();
    return projects.find(createFinder(draft.id));
  },

  async update(draft) {
    const rawDraft = toRaw(draft);
    const projects = await this.getAll();
    const index = projects.findIndex(createFinder(rawDraft.id));
    projects[index] = rawDraft;
    await chrome.storage.sync.set({ projects });
    this.onSave();
    return projects.find(createFinder(rawDraft.id));
  },

  async delete(draft) {
    const projects = await this.getAll();
    const index = projects.findIndex(createFinder(draft.id));
    projects.splice(index, 1);
    await chrome.storage.sync.set({ projects });
    this.onSave();
  },

  onSave: () => {},
};
