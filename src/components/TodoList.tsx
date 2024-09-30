"use client";
import { useState } from "react";
import scss from "./TodoList.module.scss";
import { useForm } from "react-hook-form";
import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "@/redux/api/todo";
import { useUploadFileMutation } from "@/redux/api/upload";

interface TodoFormValues {
  title: string;
  file: string;
}

const TodoList = () => {
  const { data } = useGetTodosQuery();
  const [addTodoMutation] = useAddTodoMutation();
  const [updateTodoMutation] = useUpdateTodoMutation();
  const [deleteTodoMutation] = useDeleteTodoMutation();
  const [uploadFileMutation] = useUploadFileMutation();
  const [editId, setEditId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<TodoFormValues>();
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
  } = useForm<TodoFormValues>();

  const add = async (data: TodoFormValues) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);
    const { data: imageUrl } = await uploadFileMutation(formData);

    const newTodo = {
      title: data.title,
      image: imageUrl?.url!,
    };
    await addTodoMutation(newTodo);
    reset();
  };

  const handleEdit = async (data: TodoFormValues) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);
    const { data: imageUrl } = await uploadFileMutation(formData);

    const updateData = {
      title: data.title,
      image: imageUrl?.url!,
    };
    await updateTodoMutation({
      _id: editId!,
      updatedTodo: updateData,
    });
    setEditId(null);
  };

  return (
    <section className={scss.TodoList}>
      <div className="container">
        <div className={scss.content}>
          <h1>TodoList</h1>
          <form onSubmit={handleSubmit(add)}>
            <input
              {...register("title", { required: true })}
              type="text"
              placeholder="Title"
            />
            <input type="file" {...register("file", { required: true })} />
            <button type="submit">Add</button>
          </form>

          {data?.map((item, index) => (
            <div key={index}>
              {item._id === editId ? (
                <form onSubmit={handleEditSubmit(handleEdit)}>
                  <input
                    {...registerEdit("title", { required: true })}
                    defaultValue={item.title}
                    placeholder="Title"
                  />
                  <input
                    type="file"
                    {...registerEdit("file", { required: true })}
                  />
                  <button type="submit">Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  {item.title}
                  <img src={item.image} alt="фото ноуу " />
                  <button
                    onClick={() => {
                      setEditId(item._id!);
                      setEditValue("title", item.title);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTodoMutation(item._id!)}>
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

export default TodoList;
