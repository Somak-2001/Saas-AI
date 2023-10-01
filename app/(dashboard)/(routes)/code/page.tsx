'use client';

import Heading from "@/components/Heading";
import { Code } from "lucide-react";
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
import { cn } from "@/lib/utils";
import BotAvatar from "@/components/BotAvatar";
import UserAvatar from "@/components/UserAvatar";
import ReactMarkdown from 'react-markdown';

const CodePage = () => {
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
          const response = await axios.post('/api/code',{
            messages: newMessages,
          });

          // Updating the message state with userMessage and Response
          setMessages((cur)=> [...cur,userMessage,response.data]);
          
          // To reset input values of form
          form.reset();

        } 
        catch (error: any) {
          if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.response?.data || error.message);
          } else {
            console.error('Unexpected Error:', error.message);
          }
        } 
        finally{
           router.refresh();
        }
  }

  return (
    <div>
      <Heading 
      title="Code Generation"
      description="Our most advanced coding model"
      icon={Code}
      iconColor="text-green-700"
      bgColor="bg-green-700/10"/>

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
                placeholder="Write a topic...."
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
            <div key={message.content}
            className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg',
            message.role === 'user' ? "bg-white border border-black/10" : "bg-muted")}>
              {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}

              {/* Markdown is used to get a code like structure */}
              <ReactMarkdown
              components={{
                // This is styling the explanation part
                pre: ({node,...props})=>(
                  <div className="overflow-auto w-full my-2 p-2 rounded-lg bg-black/10">
                    <pre  {...props}/>
                  </div>
                ),

                // This is to style the code part
                code: ({node,...props})=>(
                  <code {...props}
                  className="p-1 rounded-lg bg-black/10"/>
                )
              }}
              className={'text-sm overflow-hidden leading-7'}>
                {message.content || ""}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CodePage;
