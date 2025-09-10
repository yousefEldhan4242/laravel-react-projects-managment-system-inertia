<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MyTasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = Task::query()->where("assigned_user_id",$user->id);

        $sortField = request("sort_field","created_at");
        $sortDirection = request("sort_direction","desc");
        if (request("name")){
            $query->where("name","like","%".request("name")."%");
        }
        if (request("status")){
            $query->where("status", request("status"));
        }
        $tasks = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Task/Index",[
            "tasks" => TaskResource::collection($tasks),
            "queryParams" => request()->query() ?: null,
            "success" => session("success"),
            "createRoute" => "my-tasks.create",
            "destroyRoute" => "my-tasks.destroy",
            "editRoute"=>"my-tasks.edit",
            "showRoute" => "my-tasks.show",
            "indexRoute" => route("my-tasks.index")
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy("name")->get();
        $users = User::all();
        return inertia("Task/Create",[
            "projects" => ProjectResource::collection($projects),
            "users" => UserResource::collection($users),
            "storeRoute" => "my-tasks.store",
            "indexRoute" => route("my-tasks.index")
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data["created_by"] = Auth::id();
        $data["updated_by"] = Auth::id();
        if ($image){
            $data["image_path"] = $image->store("task/".Str::random(),"public");
        }
        Task::create($data);
        return to_route("my-tasks.index")->with("success","Task Was Created");
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $my_task)
    {
        return inertia("Task/Show", [
            "task" => new TaskResource($my_task),
            "editRoute" => "my-tasks.edit"
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $my_task)
    {   
        $projects = Project::query()->orderBy("name")->get();
        $users = User::query()->orderBy("name")->get();
        return inertia("Task/Edit",[
            "task" => new TaskResource($my_task),
            "projects" => ProjectResource::collection($projects),
            "users" => UserResource::collection($users),
            "updateRoute" => "my-tasks.update",
            "indexRoute" => route("my-tasks.index")
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $my_task)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data["updated_by"] = Auth::id();
        if ($image){
            if ($my_task->image_path){
            Storage::disk("public")->deleteDirectory(dirname($my_task->image_path));
            }
            $data["image_path"] = $image->store("task/".Str::random(),"public");
        }
        $my_task->update($data);
        return to_route("my-tasks.index")->with("success","Task \"$my_task->name\" Was Updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $my_task)
    {
        $name = $my_task->name;
        if ($my_task->image_path){
            Storage::disk("public")->deleteDirectory(dirname($my_task->image_path));
        }
        $my_task->delete();
        return to_route("my-tasks.index")->with("success","Task \"$name\" Was Deleted");
    }
}
