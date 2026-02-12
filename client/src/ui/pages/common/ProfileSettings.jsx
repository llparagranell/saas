import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import Input from "../../components/Input.jsx"
import Button from "../../components/Button.jsx"

export default function ProfileSettings() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profile Settings"
        description="Update your contact info and preferences."
      />
      <Card title="Personal Details" subtitle="Manage your profile">
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Full name" defaultValue="Admin One" />
          <Input label="Email" defaultValue="admin@gym.local" />
          <Input label="Phone" defaultValue="9990001111" />
          <Input label="City" defaultValue="Bengaluru" />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button>Save changes</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>
    </div>
  )
}
