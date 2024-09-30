"use client"; // Указание на то, что этот компонент должен выполняться на клиенте.

import { useState } from "react"; // Импортируем хук useState для управления состоянием.
import scss from "./TodoList.module.scss"; // Импортируем стили для этого компонента из файла SCSS.
import { useForm } from "react-hook-form"; // Импортируем хук useForm для управления формами.
import {
	useAddTodoMutation, // Хук для добавления новой задачи.
	useDeleteTodoMutation, // Хук для удаления задачи.
	useGetTodosQuery, // Хук для получения всех задач.
	useUpdateTodoMutation, // Хук для обновления задачи.
} from "@/redux/api/todo"; // Импортируем API хуки для работы с задачами из Redux.

import { useUploadFileMutation } from "@/redux/api/upload"; // Импортируем хук для загрузки файлов через API.

interface TodoFormValues {
	title: string; // Поле для названия задачи.
	file: string; // Поле для файла (например, изображения) задачи.
}

const TodoList = () => {
	const { data } = useGetTodosQuery(); // Получаем данные всех задач с сервера.
	const [addTodoMutation] = useAddTodoMutation(); // Создаем функцию для добавления новой задачи.
	const [updateTodoMutation] = useUpdateTodoMutation(); // Создаем функцию для обновления задачи.
	const [deleteTodoMutation] = useDeleteTodoMutation(); // Создаем функцию для удаления задачи.
	const [uploadFileMutation] = useUploadFileMutation(); // Создаем функцию для загрузки файла (например, изображения).
	const [editId, setEditId] = useState<number | null>(null); // Локальное состояние для отслеживания редактируемой задачи (если она есть).

	const { register, handleSubmit, reset } = useForm<TodoFormValues>(); // Инициализация формы для добавления задачи.
	const {
		register: registerEdit, // Переименовываем register для формы редактирования.
		handleSubmit: handleEditSubmit, // Переименовываем handleSubmit для формы редактирования.
		setValue: setEditValue, // Функция для установки значений полей в форме редактирования.
	} = useForm<TodoFormValues>();

	// Функция для добавления новой задачи.
	const add = async (data: TodoFormValues) => {
		const file = data.file[0]; // Получаем файл, который был загружен пользователем.
		const formData = new FormData(); // Создаем объект FormData для передачи файла.
		formData.append("file", file); // Добавляем файл в FormData.
		const { data: imageUrl } = await uploadFileMutation(formData); // Загружаем файл и получаем ссылку на изображение.

		const newTodo = {
			title: data.title, // Название задачи.
			image: imageUrl?.url!, // Ссылка на загруженное изображение.
		};
		await addTodoMutation(newTodo); // Отправляем запрос на добавление задачи.
		reset(); // Сбрасываем форму после добавления задачи.
	};

	// Функция для редактирования существующей задачи.
	const handleEdit = async (data: TodoFormValues) => {
		const file = data.file[0]; // Получаем файл для редактирования.
		const formData = new FormData(); // Создаем FormData для файла.
		formData.append("file", file); // Добавляем файл в FormData.
		const { data: imageUrl } = await uploadFileMutation(formData); // Загружаем файл и получаем ссылку на новое изображение.

		const updateData = {
			title: data.title, // Новое название задачи.
			image: imageUrl?.url!, // Ссылка на новое изображение.
		};
		await updateTodoMutation({
			_id: editId!, // ID редактируемой задачи.
			updatedTodo: updateData, // Обновленные данные задачи.
		});
		setEditId(null); // Сбрасываем режим редактирования.
	};

	return (
		<section className={scss.TodoList}>
			{" "}
			{/* Применяем стили к секции TodoList */}
			<div className="container">
				{" "}
				{/* Контейнер для центровки контента */}
				<div className={scss.content}>
					{" "}
					{/* Применяем стили к содержимому */}
					<h1>TodoList</h1> {/* Заголовок компонента */}
					{/* Форма для добавления задачи */}
					<form onSubmit={handleSubmit(add)}>
						<input
							{...register("title", { required: true })} // Поле ввода для названия задачи.
							type="text"
							placeholder="Title" // Плейсхолдер для поля.
						/>
						<input type="file" {...register("file", { required: true })} />{" "}
						{/* Поле для загрузки файла */}
						<button type="submit">Add</button>{" "}
						{/* Кнопка для добавления задачи */}
					</form>
					{/* Отображение списка задач */}
					{data?.map((item, index) => (
						<div key={index}>
							{item._id === editId ? ( // Если задача в режиме редактирования.
								<form onSubmit={handleEditSubmit(handleEdit)}>
									{" "}
									{/* Форма для редактирования задачи */}
									<input
										{...registerEdit("title", { required: true })} // Поле для изменения названия задачи.
										defaultValue={item.title} // Устанавливаем текущее значение названия.
										placeholder="Title"
									/>
									<input
										type="file"
										{...register("file", { required: true })} // Поле для загрузки нового файла.
									/>
									<button type="submit">Save</button>{" "}
									{/* Кнопка для сохранения изменений */}
									<button onClick={() => setEditId(null)}>Cancel</button>{" "}
									{/* Кнопка для отмены редактирования */}
								</form>
							) : (
								<>
									{" "}
									{/* Отображение задачи в обычном режиме */}
									{item.title} {/* Название задачи */}
									<img src={item.image} alt={item.title} />{" "}
									{/* Изображение задачи */}
									<button
										onClick={() => {
											setEditId(item._id!); // Устанавливаем ID редактируемой задачи.
											setEditValue("title", item.title); // Устанавливаем текущее название для редактирования.
										}}>
										Edit
									</button>
									<button onClick={() => deleteTodoMutation(item._id!)}>
										{" "}
										{/* Кнопка для удаления задачи */}
										Delete
									</button>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TodoList; // Экспорт компонента для использования в других частях приложения.
