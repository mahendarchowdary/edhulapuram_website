
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactData } from "@/app/content/contact-data";
import {
  Building,
  Phone,
  Shield,
  Flame,
  Power,
  Droplets,
  Mail,
  User,
  BookText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const iconMap = {
  Building,
  Shield,
  Flame,
  Power,
  Droplets,
};

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thank you for your feedback. We will get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="bg-background">
      <header className="bg-secondary/50 py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Get in touch with us for any queries, support, or feedback.
          </p>
        </div>
      </header>

      <main className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Important Contacts Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Emergency & Important Contacts
            </h2>
            <div className="space-y-6">
              {contactData.map((dept) => {
                const Icon = iconMap[dept.icon as keyof typeof iconMap] || Building;
                return (
                  <Card key={dept.name} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{dept.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-3">
                        {dept.contacts.map((contact) => (
                          <li
                            key={contact.number}
                            className="flex items-center justify-between"
                          >
                            <span className="text-muted-foreground">
                              {contact.label}
                            </span>
                            <a
                              href={`tel:${contact.number}`}
                              className="font-semibold text-primary hover:underline flex items-center gap-2"
                            >
                              <Phone className="h-4 w-4" />
                              {contact.number}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contact Form Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Send us a Message
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Have a question or concern? Fill out the form below. For
                  official correspondence, please use{" "}
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_MUNICIPALITY_EMAIL}`}
                    className="text-primary hover:underline"
                  >
                    {process.env.NEXT_PUBLIC_MUNICIPALITY_EMAIL}
                  </a>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                               <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" {...field} className="pl-10"/>
                               </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                             <FormControl>
                               <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="john.doe@example.com" {...field} className="pl-10" />
                               </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                               <div className="relative">
                                <BookText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Regarding property tax..." {...field} className="pl-10"/>
                               </div>
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe your issue or query in detail."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg">
                      Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
