import { api as index } from "..";

const TOKEN = `${process.env.NEXT_PUBLIC_API_TOKEN}`;

const api = index.injectEndpoints({
	endpoints: (build) => ({
		// Получение списка дел
		getTodos: build.query<TODO.GetTodosRes, TODO.GetTodosReq>({
			query: () => ({
				url: `/${TOKEN}/todoList`,
				method: "GET",
			}),
			providesTags: ["todo"],
		}),
		// Добавление нового дела
		addTodo: build.mutation<TODO.AddTodoRes, TODO.AddTodoReq>({
			query: (newTodo) => ({
				url: `/${TOKEN}/todoList`,
				method: "POST",
				body: newTodo,
			}),
			invalidatesTags: ["todo"],
		}),
		// Обновление существующего дела
		updateTodo: build.mutation<TODO.UpdateTodoRes, TODO.UpdateTodoReq>({
			query: ({ _id, updatedTodo }) => ({
				url: `/${TOKEN}/todoList/${_id}`,
				method: "PATCH",
				body: updatedTodo,
			}),
			invalidatesTags: ["todo"],
		}),
		// Удаление дела
		deleteTodo: build.mutation<TODO.DeleteTodoRes, TODO.DeleteTodoReq>({
			query: (_id) => ({
				url: `/${TOKEN}/todoList/${_id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["todo"],
		}),
	}),
});

export const {
	useGetTodosQuery,
	useAddTodoMutation,
	useUpdateTodoMutation,
	useDeleteTodoMutation,
} = api;
