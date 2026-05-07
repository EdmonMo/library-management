"use client"

import React, { useState, useEffect } from "react"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Book,
  Calendar,
  RefreshCw,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"

function RequestStatusBadge({ status }) {
  const variants = {
    مكتمل: {
      className: "bg-blue-100 text-blue-700 border-blue-200",
      icon: CheckCircle2,
    },
    "قيد الانتظار": {
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Clock,
    },
    مرفوض: {
      className: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
    متأخر: {
      className: "bg-orange-100 text-orange-700 border-orange-200",
      icon: AlertCircle,
    },
  }
  const config = variants[status] || variants["قيد الانتظار"]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1.5 font-medium`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  )
}

function RequestTypeBadge({ type }) {
  const variants = {
    استعارة: {
      className: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Book,
    },
    إرجاع: {
      className: "bg-purple-100 text-purple-700 border-purple-200",
      icon: RefreshCw,
    },
  }
  const config = variants[type] || variants["استعارة"]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1.5 font-medium`}
    >
      <Icon className="h-3.5 w-3.5" />
      {type}
    </Badge>
  )
}

export default function MyRequestsPage() {
  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      const userRequests = []
      setRequests(userRequests)
    }
  }, [])

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  const activeRequests = requests.filter(
    (r) => r.status === "قيد الانتظار" || r.status === "متأخر"
  )
  const completedRequests = requests.filter(
    (r) => r.status === "مكتمل" || r.status === "مرفوض"
  )

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">طلباتي</h1>
        <p className="text-muted-foreground">
          متابعة حالة طلبات استعارة وإرجاع الكتب
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            الطلبات النشطة
          </CardTitle>
          <CardDescription>الطلبات قيد الانتظار أو المتأخرة</CardDescription>
        </CardHeader>
        <CardContent>
          {activeRequests.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">الكتاب</TableHead>
                    <TableHead className="text-right">نوع الطلب</TableHead>
                    <TableHead className="text-right">تاريخ الطلب</TableHead>
                    <TableHead className="text-right">تاريخ الإرجاع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.bookTitle}</TableCell>
                      <TableCell>
                        <RequestTypeBadge type={request.type} />
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.dueDate || "-"}</TableCell>
                      <TableCell>
                        <RequestStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Clock className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-muted-foreground">لا توجد طلبات نشطة حالياً</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
            الطلبات المكتملة
          </CardTitle>
          <CardDescription>الطلبات المكتملة أو المرفوضة</CardDescription>
        </CardHeader>
        <CardContent>
          {completedRequests.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">الكتاب</TableHead>
                    <TableHead className="text-right">نوع الطلب</TableHead>
                    <TableHead className="text-right">تاريخ الطلب</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.bookTitle}</TableCell>
                      <TableCell>
                        <RequestTypeBadge type={request.type} />
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <RequestStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-muted-foreground">لا توجد طلبات سابقة</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <DialogDescription>معلومات مفصلة عن الطلب</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-muted-foreground">رقم الطلب</p>
                  <p className="text-lg font-bold">{selectedRequest.id}</p>
                </div>
                <RequestStatusBadge status={selectedRequest.status} />
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">الكتاب</Label>
                  <p className="font-medium">{selectedRequest.bookTitle}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">نوع الطلب</Label>
                  <div className="mt-1">
                    <RequestTypeBadge type={selectedRequest.type} />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">تاريخ الطلب</Label>
                  <p className="font-medium">{selectedRequest.date}</p>
                </div>
                {selectedRequest.dueDate && (
                  <div>
                    <Label className="text-muted-foreground">
                      تاريخ الإرجاع المتوقع
                    </Label>
                    <p className="font-medium">{selectedRequest.dueDate}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === "قيد الانتظار" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm text-amber-700">
                    طلبك قيد المراجعة. سيتم إشعارك عند الموافقة عليه.
                  </p>
                </div>
              )}

              {selectedRequest.status === "مرفوض" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">
                    عذراً، تم رفض طلبك. قد يكون الكتاب غير متاح أو تجاوزت الحد
                    المسموح.
                  </p>
                </div>
              )}

              {selectedRequest.status === "مكتمل" &&
                selectedRequest.type === "استعارة" && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">
                      تمت الموافقة على طلبك. يمكنك استلام الكتاب من المكتبة.
                    </p>
                  </div>
                )}
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
