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

const Conversationpage = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    // Resolver is added to validate the form
    resolver: zodResolver(FormSchema),
    defaultValues:{
      prompt: ""
    }
  });

  const isloading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) =>{
        console.log(values);
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
    </div>
  )
}

export default Conversationpage;
