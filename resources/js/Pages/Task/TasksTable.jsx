import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Link, router } from "@inertiajs/react";
import React from "react";

const TasksTable = ({tasks,queryParams=null,hideProjectColumn=false ,destroyRoute="task.destroy",editRoute="task.edit",showRoute="task.show",indexRoute="task.index"}) => {
    queryParams = queryParams || {};
    
        const searchFieldChanged = (name, value) => {
        // dont fetch data if the search value isn't changed
        if (queryParams[name] != value) {
            if (value) {
                queryParams[name] = value;
            } else {
                delete queryParams[name];
            }
            router.get(indexRoute, queryParams);
        }
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;
        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name == queryParams.sort_field) {
            // reverse direction on click on same field
            if (queryParams.sort_direction == "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(indexRoute, queryParams);
    };

        if (tasks.data.length == 0) {
        return (
            <div className="text-red-600 font-bold text-center">No Tasks Available</div>
        )
    }
    const onDeleteTask = (id) => {
        if (confirm("Are You sure You Want To Delete This Task?")){
                router.delete(route(destroyRoute, id));
            
        }
    };

    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400
                                border-b-2 border-gray-500"
                    >
                        <tr className="text-nowrap">
                            <TableHeading
                                name={"id"}
                                sortChanged={sortChanged}
                                sort_direction={queryParams.sort_direction}
                                sort_field={queryParams.sort_field}
                            >
                                ID
                            </TableHeading>
                            <th className="p-3">Image</th>
                            {!hideProjectColumn && (<th className="p-3">Project Name</th>)}
                            <TableHeading
                                name={"name"}
                                sortChanged={sortChanged}
                                sort_direction={queryParams.sort_direction}
                                sort_field={queryParams.sort_field}
                            >
                                Name
                            </TableHeading>
                            <TableHeading
                                name={"status"}
                                sortChanged={sortChanged}
                                sort_direction={queryParams.sort_direction}
                                sort_field={queryParams.sort_field}
                            >
                                Status
                            </TableHeading>
                            <TableHeading
                                name={"created_at"}
                                sortChanged={sortChanged}
                                sort_direction={queryParams.sort_direction}
                                sort_field={queryParams.sort_field}
                            >
                                Create Date
                            </TableHeading>
                            <TableHeading
                                name={"due_date"}
                                sortChanged={sortChanged}
                                sort_direction={queryParams.sort_direction}
                                sort_field={queryParams.sort_field}
                            >
                                Due Date
                            </TableHeading>
                            <th className="p-3">Created By</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400
                                border-b-2 border-gray-500"
                    >
                        <tr className="text-nowrap">
                            <th className="p-3"></th>

                            <th className="p-3"></th>
                            {!hideProjectColumn && (<th className="p-3"></th>)}
                            <th className="p-3">
                                <TextInput
                                    className="w-full"
                                    placeholder="Task Name"
                                    defaultValue={queryParams?.name}
                                    onBlur={(e) =>
                                        searchFieldChanged(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={(e) => onKeyPress("name", e)}
                                />
                            </th>
                            <th className="p-3">
                                <SelectInput
                                    defaultValue={queryParams?.status}
                                    className="w-full"
                                    onChange={(e) =>
                                        searchFieldChanged(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </th>
                            <th className="p-3"></th>
                            <th className="p-3"></th>
                            <th className="p-3"></th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.data.map((task) => (
                            <tr
                                key={task.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <td className="px-3 py-2">{task.id}</td>
                                <td className="px-3 py-2">
                                    <img
                                        src={task.image_path}
                                        alt={task.name}
                                        style={{ width: 60 }}
                                    />
                                </td>
                                {!hideProjectColumn && (<td className="px-3 py-2">{task.project.name}</td>)}
                                <th className="px-3 py-2 text-gray-100 hover:underline">
                                    <Link
                                        href={route(
                                            showRoute,
                                            task.id
                                        )}
                                    >
                                        {task.name}
                                    </Link>
                                </th>
                                <td className="px-3 py-2">
                                    <span
                                        className={
                                            "px-2 py-1 text-nowrap rounded text-white " +
                                            TASK_STATUS_CLASS_MAP[task.status]
                                        }
                                    >
                                        {TASK_STATUS_TEXT_MAP[task.status]}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    {task.created_at}
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    {task.due_date}
                                </td>
                                <td className="px-3 py-2">
                                    {task.createdBy.name}
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    <Link
                                        href={ route(editRoute, task.id)}
                                        className="font-medium text-blue-600
                                                    dark:text-blue-500 hover:underline mx-1"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={ () => 
                                        onDeleteTask(task.id)
                                        }
                                        className="font-medium text-red-600
                                                    dark:text-red-500 hover:underline mx-1"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={tasks.meta.links} queryParams={queryParams} />
        </>
    );
};

export default TasksTable;
