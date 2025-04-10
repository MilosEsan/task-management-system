<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    protected $aiClient;

    public function generateNotificationContent(User $user, string $taskName)
    {
        try {
            $prompt = 'Please explain to the manager that the user has this task "' . $taskName . '"is completed. Also motivate the manager to use the app more often.';
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('HUGGINGFACE_API_KEY')
            ])->post('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', [
                'inputs' => $prompt,
            ]);
            
            $data = $response->json();
            $generatedText = $data[0]['generated_text'] ?? 'The task "' . $taskName . '" is finished. Thank you for using our app';
            $generatedText = trim(strip_tags($generatedText));
    
            if (str_starts_with($generatedText, $prompt)) {
                $generatedText = str_replace($prompt, '', $generatedText);
                $generatedText = ltrim($generatedText); // ukloni prazninu nakon prompta
            }
            \Log::info('Generated text:', ['text' => $generatedText]);
    
            return $generatedText;
        } catch (\Exception $e) {
            \Log::error('Error:', ['message' => $e->getMessage()]);
            return 'Error generating notifications.';
        }
    }
}
