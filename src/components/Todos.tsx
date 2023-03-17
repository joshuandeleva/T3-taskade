import { api } from "~/utils/api"
import { SigleTodo } from "./Todo"
export const Todos = () => {

    const { data: todos, isLoading, isError } = api.todo.all.useQuery()

    if (isLoading) return <div>Loading todos</div>
    if (isError) return <div>Error fetching todos </div>

    return (
        <div>
            {todos.length ? todos.map((todo) => {
                return (
                    <SigleTodo key={todo.id} todo={todo} />
                )
            }) : 'Create your first todo'}
        </div>

    )

}