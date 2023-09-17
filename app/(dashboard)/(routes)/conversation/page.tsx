'use client';

import Heading from "@/components/Heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormSchema } from "./constants";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from 'axios';
import { ChatCompletionRequestMessage } from "openai";

const Conversationpage = () => {
  const router = useRouter();

  // Creating a state for messages/promt to be stored
  const [messages, setMessages] = useState< ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    // Resolver is added to validate the form
    resolver: zodResolver(FormSchema),
    defaultValues:{
      prompt: ""
    }
  });

  // Checking if the form data is submitting
  const isloading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) =>{
        try {
          // Wrapping up the values of form input
          const userMessage: ChatCompletionRequestMessage = {
            role: 'user',
            content: values.prompt,
          };
          
          // It is the payload or the input message to be sent to openai
          const newMessages = [...messages,userMessage];

          // Making a axios POST request
          const response = await axios.post('/api/conversation',{
            messages: newMessages,
          });

          // Updating the message state with userMessage and Response
          setMessages((cur)=> [...cur,userMessage,response.data]);
          
          // To reset input values of form
          form.reset();

        } 
        catch (error: any) {
          console.log(error);
        } 
        finally{
           router.refresh();
        }
  }

  return (
    <div>
      <Heading 
      title="Conversation"
      description="Our most advanced conversation model"
      icon={MessageSquare}
      iconColor="text-violet-500"
      bgColor="text-violet-500/10"/>

      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-md
          grid
          grid-cols-12
          gap-2"
          >
           <FormField 
           name="prompt"
           render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-10">
              <FormControl className="m-0 p-0">
                <Input 
                className="border-0 outline-none 
                focus-visible:ring-0
                focus-visible:ring-transparent"
                disabled={isloading}
                placeholder="Send a message"
                // field is expanding coz field has the props onChange, onBlur, value,name, ref. So we don't have to explicitly add these props 
                {...field} 
                />
              </FormControl>
            </FormItem>
          )}
           />

           <Button className="col-span-12 lg:col-span-2"
            disabled={isloading}>
               Generate
           </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message)=>(
            <div key={message.content}>
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Conversationpage;
