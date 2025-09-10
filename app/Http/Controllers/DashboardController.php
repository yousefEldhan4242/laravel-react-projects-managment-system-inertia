<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProjectRequest;
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

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $totalPendingTasks = Task::query()->where("status", "pending")->count();
        $myPendingTasks = Task::query()->where("status", "pending")->where("assigned_user_id", $user->id)->count();


        $totalInProgressTasks = Task::query()->where("status", "in_progress")->count();
        $myInProgressTasks = Task::query()->where("status", "in_progress")->where("assigned_user_id", $user->id)->count();


        $totalCompeletedTasks = Task::query()->where("status", "completed")->count();
        $myCompeletedTasks = Task::query()->where("status", "completed")->where("assigned_user_id", $user->id)->count();

        $activeTasks = Task::query()->whereIn("status", ["pending", "in_progress"])->where("assigned_user_id", $user->id)->limit(10)->get();
        $activeTasks = TaskResource::collection($activeTasks);

        return inertia('Dashboard', [
            "totalPendingTasks"=>$totalPendingTasks,
            "myPendingTasks"=>$myPendingTasks,
            "totalInProgressTasks"=>$totalInProgressTasks,
            "myInProgressTasks"=>$myInProgressTasks,
            "totalCompeletedTasks"=>$totalCompeletedTasks,
            "myCompeletedTasks"=> $myCompeletedTasks,
            "activeTasks" => $activeTasks,
            "success" => session("success")
        ]);
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
    public function show(Request $request,string $id)
    {
        $toShow = $request->input('to_show');
        if ($toShow == "project"){
        $project = Project::find($id);
        $query = $project->tasks();
        $sortField = request("sort_field","created_at");
        $sortDirection = request("sort_direction","desc");
        if (request("name")){
            $query->where("name","like","%".request("name")."%");
        }
        if (request("status")){
            $query->where("status", request("status"));
        }
        $tasks = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Project/Show", [
            "project" => new ProjectResource($project),
            "tasks" => TaskResource::collection($tasks),
            "queryParams" => request()->query() ?: null,
            "success"=> session("success"),
            "editRoute" => "dashboard.edit"
        ]);
        }

        $task = Task::find($id);
        return inertia("Task/Show", [
            "task" => new TaskResource($task),
            "editRoute" => "dashboard.edit"
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request,string $id)
    {
        $toShow = $request->input('to_show');
        if ($toShow == "project"){
            $project = Project::find($id);
            return inertia("Project/Edit",[
            "project" => new ProjectResource($project),
            "updateRoute" => "dashboard.update",
            "indexRoute" => route("dashboard.index")
        ]);
        }

        $task = Task::find($id);
        $projects = Project::query()->orderBy("name")->get();
        $users = User::query()->orderBy("name")->get();
        return inertia("Task/Edit",[
            "task" => new TaskResource($task),
            "projects" => ProjectResource::collection($projects),
            "users" => UserResource::collection($users),
            "updateRoute" => "dashboard.update",
            "indexRoute" => route("dashboard.index")
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $requestClass = $request['to_show'] === 'project' 
        ? UpdateProjectRequest::class 
        : UpdateTaskRequest::class;
    
        $toShow = $request['to_show'];
        if ($toShow == "project"){
            $project = Project::find($id);
            $data = $request->validateWithBag('update', (new $requestClass)->rules());
            $image = $data['image'] ?? null;
            $data["updated_by"] = Auth::id();
            if ($image){
                if ($project->image_path){
                Storage::disk("public")->deleteDirectory(dirname($project->image_path));
                }
                $data["image_path"] = $image->store("project/".Str::random(),"public");
            }
            $project->update($data);
            return to_route("dashboard.index")->with("success","Project \"$project->name\" Was Updated");
        }
        $task = Task::find($id);
        $data = $request->validateWithBag('update', (new $requestClass)->rules());
        $image = $data['image'] ?? null;
        $data["updated_by"] = Auth::id();
        if ($image){
            if ($task->image_path){
            Storage::disk("public")->deleteDirectory(dirname($task->image_path));
            }
            $data["image_path"] = $image->store("task/".Str::random(),"public");
        }
        $task->update($data);
        return to_route("dashboard.index")->with("success","Task \"$task->name\" Was Updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $dashboard)
    {
        //
    }
}
