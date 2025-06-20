import {defineStore} from "pinia";
import axiosInstance from "../../helpers/axios";
import {useCacheStore} from "./cache";
import {useQueryStore} from "./queryStore";

const STORE_ID = 'tasks';

export const useTasksStore = defineStore({
    id: STORE_ID,
    state: () => ({
        tasks: {},
        errors: {},
        locked: {},
        pagination: {},
        loading: {}
    }),
    getters: {
        getTasks: (state) => {
            return (projectId) => state.tasks[projectId] ?? {};
        },
        error: (state) => {
            return (projectId) => state.errors[projectId] ?? '';
        },
        isLocked: (state) => {
            return (id) => state.locked[id] ?? false;
        },
        isLoading: (state) => {
            return (projectId) => state.loading[projectId] ?? false;
        },
        getPaginationMetadata: (state) => {
            return (projectId) => state.pagination[projectId] ?? {};
        }
    },
    actions: {
        async create(projectId, task) {
            this.errors[projectId] = '';
            return axiosInstance.post(`/projects/${projectId}/tasks/`, task)
                .then((response) => {
                    const id = response.data.id;
                    task.id = id;
                    if (this.tasks[projectId] === undefined) {
                        this.tasks[projectId] = {};
                    }
                    this.tasks[projectId][id] = {};
                    for (const [key, value] of Object.entries(task)) {
                        this.tasks[projectId][id][key] = value;
                    }
                    this.tasks[projectId][id].startDate = new Date(this.tasks[projectId][id].startDate);
                    this.tasks[projectId][id].finishDate = new Date(this.tasks[projectId][id].finishDate);
                })
                .catch((error) => {
                    this.errors[projectId] = error.response.data.message;
                });
        },
        async load(projectId) {
            this.errors[projectId] = '';
            this.loading[projectId] = true;
            const cache = useCacheStore();
            const queryStore = useQueryStore();

            return cache.request(
                STORE_ID + projectId + queryStore.getHash,
                () => axiosInstance
                    .get(`/projects/${projectId}/tasks/`, {
                        params: queryStore.getParams
                    })
                    .then((response) => {
                        this.tasks[projectId] = {};
                        for (const [key, value] of Object.entries(response.data.items)) {
                            this.tasks[projectId][value.id] = value;
                            this.tasks[projectId][value.id].startDate = new Date(value.startDate);
                            this.tasks[projectId][value.id].finishDate = new Date(value.finishDate);
                        }

                        this.pagination[projectId] = response.data.page;

                        return response;
                    })
                    .catch((error) => {
                        this.errors[projectId] = error.response.data.message;
                        throw error;
                    })
                )
                .finally(() => {
                    this.loading[projectId] = false;
                });
        }
    }
});
