'use client';

import Heading from "@/components/Heading";
import { Music } from "lucide-react";
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
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";

const MusicPage = () => {
  const router = useRouter();

  // Creating a state for messages/promt to be stored
  const [music, setMusic] = useState<string>();

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
          // Clearing the previous value
          setMusic(undefined);

          // Making a axios POST request
          const response = await axios.post('/api/music');
 
          // Setting the audio
          setMusic(response.data.audio);

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
      title="Music Generation"
      description="Turn your prompt into music"
      icon={Music}
      iconColor="text-emerald-500"
      bgColor="bg-emerald-500/10"/>

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
                placeholder="Let's play some music"
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
      {isloading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
      {!music && !isloading && (
        <Empty label="No audio generated."/>
      )}

       {/* Now the audio element is added */}
       {music && !isloading && (
        <audio controls className="w-full mt-8">
          <source src={music}/>
        </audio>
       )}
       
      </div>
    </div>
  )
}

export default MusicPage;
