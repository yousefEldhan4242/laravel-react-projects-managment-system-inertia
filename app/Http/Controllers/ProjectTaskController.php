<?php

namespace App\Http\Controllers;

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

class ProjectTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $project_task)
    {
        return inertia("Task/Show", [
            "task" => new TaskResource($project_task),
            "editRoute" => "project-task.edit"
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $project_task)
    {
        $projects = Project::query()->orderBy("name")->get();
        $users = User::query()->orderBy("name")->get();
        return inertia("Task/Edit",[
            "task" => new TaskResource($project_task),
            "projects" => ProjectResource::collection($projects),
            "users" => UserResource::collection($users),
            "updateRoute" => "project-task.update",
            "indexRoute" => route("project.show", $project_task->id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $project_task)
    {
        // dd($project_task);
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data["updated_by"] = Auth::id();
        if ($image){
            if ($project_task->image_path){
            Storage::disk("public")->deleteDirectory(dirname($project_task->image_path));
            }
            $data["image_path"] = $image->store("task/".Str::random(),"public");
        }
        $project_task->update($data);
        return to_route("project.show",$project_task->project->id)->with("success","Task \"$project_task->name\" Was Updated");
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $project_task)
    {
        $name = $project_task->name;
        if ($project_task->image_path){
            Storage::disk("public")->deleteDirectory(dirname($project_task->image_path));
        }
        $project_task->delete();
        return to_route("project.show",$project_task->project->id)->with("success","Task \"$name\" Was Deleted");
    }
}
