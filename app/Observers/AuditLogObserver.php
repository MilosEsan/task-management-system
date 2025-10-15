<?php
namespace App\Observers;
use Illuminate\Support\Facades\Auth;

use App\Models\AuditLog;

class AuditLogObserver
{


    private function compareValues(array $new, array $old): array
    {
        $changes = [];

        foreach ($new as $key => $newValue) {
            $oldValue = $old[$key] ?? null;

            if ($newValue !== $oldValue && $key !== "created_at") {
                $changes[$key] = [
                    'changed_to' => $newValue,
                ];
            }
        }

        return $changes;
    }

    private function checkIsUserAuthenticated($model): ?int {
        $id = Auth::id();
        return $id ? (int)$id : null;
    }


    private function checkModelType($model): string {
        $value = get_class($model);

        if ($value === "App\Models\Task") {
            return "task";
        } else if ($value === "App\Models\Transaction") {
            return "transaction";
        }
        return "other";
    }

    private function createLog($model, string $action): array {
        $log = [
            'user_id' => $this->checkIsUserAuthenticated($model),
            'task_id' => $this->checkModelType($model) === 'task' ? $model->id : null,
            'transaction_id' => $this->checkModelType($model) === 'transaction' ? $model->id : null,
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'ip_address' => request()->ip(),
            'device_info' => request()->header('User-Agent')
        ];

        if ($action == 'created' || $action == 'updated') {
            if ($action == 'updated') {
                $changes = $this->compareValues($model->getAttributes(), $model->getOriginal());
                $log['new_values'] = json_encode($changes);
            } else {
                $log['new_values'] = json_encode($model->getAttributes());
            }
        }

        if ($action == 'deleted' || $action == 'updated') {
            $log['old_values'] = json_encode($model->getOriginal());
        }

        return $log;
    }

    public function created($model)
    {
        $log = $this->createLog($model, 'created');
        AuditLog::create($log);
    }

    public function updated($model)
    {
        $log = $this->createLog($model, 'updated');
        AuditLog::create($log);
    }

    public function deleting($model)
    {
        $log = $this->createLog($model, 'deleted');
        AuditLog::create($log);
    }

    public function deleted($model)
        {
            // no-op
        }
}