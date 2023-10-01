'use client';

import Heading from "@/components/Heading";
import { VideoIcon } from "lucide-react";
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

import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";

const VideoPage = () => {
  const router = useRouter();

  // Creating a state for messages/promt to be stored
  const [video, setVideo] = useState<string>();

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
          setVideo(undefined);

          // Making a axios POST request
          const response = await axios.post('/api/video');
 
          // Setting the audio
          setVideo(response.data[0]);

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
      title="Video Generation"
      description="Turn your prompt into video"
      icon={VideoIcon}
      iconColor="text-orange-700"
      bgColor="bg-orange-700/10"/>

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
                placeholder="Let's play with video...."
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
      {!video && !isloading && (
        <Empty label="No video generated."/>
      )}

       {/* Now the video element is added */}
       {video && !isloading && (
        <video controls className="w-full aspect-video mt-8 rounded-lg border border-black">
          <source src={video} />
        </video>
       )}
       
      </div>
    </div>
  )
}

export default VideoPage;
