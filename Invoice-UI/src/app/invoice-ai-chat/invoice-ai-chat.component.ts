import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceAiChatService } from './invoice-ai-chat.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-invoice-ai-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './invoice-ai-chat.component.html',
  styleUrls: ['./invoice-ai-chat.component.css']
})
export class InvoiceAiChatComponent {
  userInput: string = '';
  messages: { text: string, sender: 'user' | 'bot' }[] = [];

  constructor(private invoiceAiChatService: InvoiceAiChatService) { }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ text: this.userInput, sender: 'user' });
      const userMessage = this.userInput;
      this.userInput = '';

      this.invoiceAiChatService.sendMessage(userMessage)
        .subscribe(
          (response) => {
            this.messages.push({ text: response.response, sender: 'bot' });
          },
          (error) => {
            this.messages.push({ text: 'Error fetching response from the server.', sender: 'bot' });
          }
        );
    }
  }
}
