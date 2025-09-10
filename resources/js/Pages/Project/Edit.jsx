import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react'

const Edit = ({project,updateRoute="project.update",indexRoute="project.index"}) => {
    const {data,setData,errors,post,reset} = useForm({
        image:'',
        image_path:project.image_path || "",
        name:project.name ||'',
        status:project.status ||'',
        description:project.description || "",
        due_date:project.due_date || "",
        _method:"PUT",
        to_show: updateRoute == "dashboard.update" && "project",
    })
    const onSubmit = (e) => {
        e.preventDefault();
        post(route(updateRoute,project.id))
    }
  return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit Project "{data.name}"
                </h2>
            }
        >
            <Head title="Create Project" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <form onSubmit={onSubmit} className='p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg'>
                                {data.image_path && (
                                    <div className='mb-4'>
                                        <img src={data.image_path} alt={data.name} className='w-64' />
                                    </div>
                                )}
                                <div className='mt-4'>
                                    <InputLabel htmlFor="project_image_path" value={"Project Image"}/>
                                    <TextInput id="project_image_path" name="image" type="file"
                                    className="mt-1 block w-full" onChange={(e) => {
                                        setData("image",e.target.files[0])
                                        setData("image_path",URL.createObjectURL(e.target.files[0]))
                                        } }/>
                                    <InputError message={errors.image} className='mt-2' />
                                </div>
                                <div className='mt-4'>
                                    <InputLabel htmlFor="project_name" value={"Project Name"}/>
                                    <TextInput id="project_name" name="name" type="text" value={data.name}
                                    className="mt-1 block w-full" isFocused={true} onChange={(e) => setData("name",e.target.value)}/>
                                    <InputError message={errors.name} className='mt-2' />
                                </div>
                                <div className='mt-4'>
                                    <InputLabel htmlFor="project_description" value={"Project Description"}/>
                                    <TextAreaInput id="project_description" name="description" value={data.description}
                                    className="mt-1 block w-full" onChange={(e) => setData("description",e.target.value)}/>
                                    <InputError message={errors.description} className='mt-2' />
                                </div>
                                <div className='mt-4'>

                                    <InputLabel htmlFor="project_due_date" value={"Project DeadLine"}/>
                                    <TextInput id="project_due_date" name="due_date" type="date" value={data.due_date}
                                    className="mt-1 block w-full accent-white" onChange={(e) => setData("due_date",e.target.value)}/>
                                    <InputError message={errors.due_date} className='mt-2' />
                                </div>
                                <div className='mt-4'>

                                    <InputLabel htmlFor="project_status" value={"Project Status"}/>
                                    <SelectInput id="project_status" name="status" value={data.status}
                                    className="mt-1 block w-full" onChange={(e) => setData("status",e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className='mt-2' />
                                </div>
                                <div className='mt-4 text-right'>
                                    <Link href={indexRoute} className='bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all
                                    hover:bg-gray-200 mr-2'>
                                    Cancel
                                    </Link>
                                <button className=' bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600'>
                                    Submit
                                </button>
                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Edit
