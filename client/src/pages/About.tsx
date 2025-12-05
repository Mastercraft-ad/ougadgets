import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="font-heading font-bold text-4xl mb-8 text-center">About O&U Gadgets</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed mb-12 text-center">
          <p>
            O&U Gadgets was founded with a simple mission: to bring transparency to the mobile phone market. 
            We believe you shouldn't have to guess if you're getting a good deal. 
          </p>
          <p>
            By comparing our prices directly against major market retailers, we show you exactly how much you save 
            on every purchase. Whether you're looking for the latest flagship or a reliable budget device, 
            we ensure quality and value.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-primary">Warranty Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We stand behind the quality of our devices. All phones purchased from O&U Gadgets come with a 
                standard <strong>48-hour testing warranty</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The warranty period begins from the moment of delivery/pickup.</li>
                <li>Covers functional defects not disclosed at the time of purchase.</li>
                <li>Does not cover physical damage, water damage, or software modifications caused by the user.</li>
                <li>Returns must include the original receipt and packaging (if applicable).</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
